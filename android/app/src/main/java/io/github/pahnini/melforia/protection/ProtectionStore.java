package io.github.pahnini.melforia.protection;

import android.accessibilityservice.AccessibilityServiceInfo;
import android.content.Context;
import android.content.SharedPreferences;
import android.view.accessibility.AccessibilityManager;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.TimeZone;

public final class ProtectionStore {
    private static final Object LOCK = new Object();
    public static final String[] CATEGORIES = { "sexism", "insult", "body", "harassment", "threat" };
    private final Context context;
    private final SharedPreferences preferences;
    public ProtectionStore(Context context) {
        this.context = context.getApplicationContext();
        this.preferences = this.context.getSharedPreferences("melforia_digital_protection_v1", Context.MODE_PRIVATE);
    }
    public JSONObject config() throws JSONException { synchronized (LOCK) {
        JSONObject raw;
        try { raw = new JSONObject(preferences.getString("config", "{}")); } catch (JSONException exception) { raw = new JSONObject(); }
        return cleanConfig(raw);
    } }
    public static JSONObject cleanConfig(JSONObject raw) throws JSONException {
        String level = raw.optString("level", "balanced");
        if (!"gentle".equals(level) && !"strict".equals(level)) level = "balanced";
        JSONObject categories = new JSONObject();
        JSONObject from = raw.optJSONObject("categories");
        for (String category : CATEGORIES) categories.put(category, from == null || !Boolean.FALSE.equals(from.opt(category)));
        JSONArray words = new JSONArray(); Set<String> seen = new HashSet<>();
        JSONArray input = raw.optJSONArray("customWords");
        if (input != null) for (int i = 0; i < input.length() && words.length() < 40; i++) {
            Object value = input.opt(i); if (!(value instanceof String)) continue;
            String word = ((String) value).trim(); if (word.isEmpty()) continue;
            word = word.substring(0, Math.min(word.length(), 60));
            if (seen.add(ProtectionRuleEngine.normalize(word))) words.put(word);
        }
        return new JSONObject().put("level", level).put("categories", categories).put("customWords", words).put("autoCollect", Boolean.TRUE.equals(raw.opt("autoCollect")));
    }
    public void configure(JSONObject value) throws JSONException { synchronized (LOCK) {
        if (!preferences.edit().putString("config", cleanConfig(value).toString()).commit()) throw new IllegalStateException("Cannot save configuration");
    } }
    public boolean enabled() { return preferences.getBoolean("enabled", false) && preferences.getInt("consentVersion", 0) == 1; }
    public void enable(boolean value) {
        if (value && (preferences.getInt("consentVersion", 0) != 1 || !serviceEnabled())) throw new IllegalStateException("Permission and disclosure required");
        if (!preferences.edit().putBoolean("enabled", value).commit()) throw new IllegalStateException("Cannot save activation");
    }
    public void acceptDisclosure() { if (!preferences.edit().putInt("consentVersion", 1).commit()) throw new IllegalStateException("Cannot save disclosure"); }
    public boolean serviceEnabled() {
        AccessibilityManager manager = (AccessibilityManager) context.getSystemService(Context.ACCESSIBILITY_SERVICE);
        if (manager == null) return false;
        for (AccessibilityServiceInfo info : manager.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_ALL_MASK)) {
            android.content.pm.ServiceInfo service = info.getResolveInfo().serviceInfo;
            if (context.getPackageName().equals(service.packageName) && ProtectionAccessibilityService.class.getName().equals(service.name)) return true;
        }
        return false;
    }
    public JSONArray entries() { synchronized (LOCK) { return array("entries"); } }
    private JSONArray array(String key) {
        try { return new JSONArray(preferences.getString(key, "[]")); } catch (JSONException exception) { return new JSONArray(); }
    }
    public JSONObject snapshot() throws JSONException {
        return new JSONObject().put("enabled", enabled()).put("serviceEnabled", serviceEnabled())
            .put("connected", ProtectionAccessibilityService.isConnected()).put("consentVersion", preferences.getInt("consentVersion", 0))
            .put("config", config()).put("entries", entries());
    }
    public boolean save(String input, String category, String source, boolean automatic) throws Exception { synchronized (LOCK) {
        String text = input.substring(0, Math.min(input.length(), 500));
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] bytes = digest.digest((source + "\n" + text).getBytes(StandardCharsets.UTF_8));
        StringBuilder hash = new StringBuilder("native-");
        for (byte value : bytes) hash.append(String.format(Locale.ROOT, "%02x", value & 0xff));
        String id = hash.toString(); JSONArray blocked = array("dismissed");
        if (automatic) for (int i = 0; i < blocked.length(); i++) if (id.equals(blocked.optString(i))) return false;
        JSONArray entries = entries();
        for (int i = 0; i < entries.length(); i++) if (id.equals(entries.optJSONObject(i).optString("id"))) return false;
        if (entries.length() >= 200) return false;
        SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US); date.setTimeZone(TimeZone.getTimeZone("UTC"));
        JSONObject entry = new JSONObject().put("id", id).put("text", text).put("category", category)
            .put("capturedAt", date.format(new Date())).put("source", source);
        JSONArray next = new JSONArray().put(entry);
        for (int i = 0; i < entries.length(); i++) next.put(entries.get(i));
        JSONArray nextBlocked = new JSONArray();
        for (int i = 0; i < blocked.length(); i++) if (!id.equals(blocked.optString(i))) nextBlocked.put(blocked.get(i));
        if (!preferences.edit().putString("entries", next.toString()).putString("dismissed", nextBlocked.toString()).commit()) throw new IllegalStateException("Cannot save text");
        return true;
    } }
    public void delete(String id) throws JSONException { synchronized (LOCK) {
        JSONArray current = entries(), next = new JSONArray(), dismissed = array("dismissed");
        boolean found = false;
        for (int i = 0; i < current.length(); i++) {
            JSONObject entry = current.getJSONObject(i);
            if (!id.equals(entry.optString("id"))) next.put(entry); else found = true;
        }
        if (!found) return;
        if (dismissed.length() < 1000) dismissed.put(id);
        // At the bound, stop automatic collection rather than recreating deleted entries.
        JSONObject settings = config(); if (dismissed.length() >= 1000) settings.put("autoCollect", false);
        if (!preferences.edit().putString("entries", next.toString()).putString("dismissed", dismissed.toString()).putString("config", settings.toString()).commit()) throw new IllegalStateException("Cannot delete text");
    } }
    public ProtectionRuleEngine engine() throws Exception {
        String json;
        try (InputStream input = context.getAssets().open("public/protection-rules.json"); ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[4096]; int count;
            while ((count = input.read(buffer)) != -1) output.write(buffer, 0, count);
            json = output.toString(StandardCharsets.UTF_8.name());
        }
        JSONArray rules = new JSONArray(json); List<ProtectionRuleEngine.Rule> parsed = new ArrayList<>();
        for (int i = 0; i < rules.length(); i++) { JSONObject rule = rules.getJSONObject(i); parsed.add(new ProtectionRuleEngine.Rule(rule.getString("category"), rule.getInt("severity"), rule.getString("pattern"))); }
        return new ProtectionRuleEngine(parsed);
    }
    public String assess(ProtectionRuleEngine engine, String text, JSONObject config) {
        Set<String> categories = new HashSet<>(); List<String> words = new ArrayList<>();
        JSONObject configured = config.optJSONObject("categories");
        for (String category : CATEGORIES) if (configured != null && configured.optBoolean(category)) categories.add(category);
        JSONArray custom = config.optJSONArray("customWords"); if (custom != null) for (int i = 0; i < custom.length(); i++) words.add(custom.optString(i));
        return engine.assess(text, config.optString("level", "balanced"), categories, words);
    }
}
