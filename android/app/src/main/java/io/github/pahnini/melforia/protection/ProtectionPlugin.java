package io.github.pahnini.melforia.protection;

import android.app.Activity;
import android.content.Intent;
import android.provider.Settings;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@CapacitorPlugin(name = "MelforiaProtection")
public class ProtectionPlugin extends Plugin {
    private ProtectionStore store() { return new ProtectionStore(getContext()); }
    private void resolve(PluginCall call) { try { call.resolve(new JSObject(store().snapshot().toString())); } catch (Exception exception) { call.reject("Der Schutzstatus konnte nicht verarbeitet werden."); } }
    @PluginMethod public void getState(PluginCall call) { resolve(call); }
    @PluginMethod public void configure(PluginCall call) {
        JSObject config = call.getObject("config");
        if (config == null) { call.reject("Konfiguration fehlt."); return; }
        try { store().configure(config); ProtectionAccessibilityService.refresh(); resolve(call); }
        catch (Exception exception) { call.reject("Die Regeln konnten nicht gespeichert werden."); }
    }
    @PluginMethod public void acceptDisclosure(PluginCall call) {
        if (!Integer.valueOf(1).equals(call.getInt("version"))) { call.reject("Unbekannte Hinweismeldung."); return; }
        try { store().acceptDisclosure(); resolve(call); } catch (Exception exception) { call.reject("Deine Auswahl konnte nicht gespeichert werden."); }
    }
    @PluginMethod public void openAccessibilitySettings(PluginCall call) {
        try {
            if (store().snapshot().optInt("consentVersion") != 1) { call.reject("Bitte bestätige zuerst den Hinweis zum Bildschirmzugriff."); return; }
            getActivity().startActivity(new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)); call.resolve();
        } catch (Exception exception) { call.reject("Die Android-Einstellungen konnten nicht geöffnet werden."); }
    }
    @PluginMethod public void setEnabled(PluginCall call) {
        Boolean enabled = call.getBoolean("enabled");
        if (enabled == null) { call.reject("Auswahl fehlt."); return; }
        try { store().enable(enabled); ProtectionAccessibilityService.refresh(); resolve(call); }
        catch (Exception exception) { call.reject("Bitte erlaube den Dienst zuerst in Android."); }
    }
    @PluginMethod public void openDemo(PluginCall call) {
        if (!store().enabled() || !store().serviceEnabled()) { call.reject("Aktiviere zuerst den Schutz."); return; }
        getActivity().startActivity(new Intent(getContext(), ProtectionDemoActivity.class)); call.resolve();
    }
    @PluginMethod public void deleteEntry(PluginCall call) {
        String id = call.getString("id");
        if (id == null || id.length() > 100) { call.reject("Ungültiger Eintrag."); return; }
        try { store().delete(id); resolve(call); } catch (Exception exception) { call.reject("Der Eintrag konnte nicht gelöscht werden."); }
    }
    @PluginMethod public void exportCollection(PluginCall call) {
        JSArray input = call.getArray("entries");
        if (input == null || input.length() > 200) { call.reject("Ungültige Sammlung."); return; }
        try {
            JSONArray entries = new JSONArray();
            for (int i = 0; i < input.length(); i++) {
                JSONObject entry = input.getJSONObject(i);
                String text = entry.getString("text");
                if (text.length() > 500) { call.reject("Eintrag ist zu lang."); return; }
                entries.put(new JSONObject().put("id", entry.optString("id")).put("text", text).put("category", entry.optString("category"))
                    .put("source", entry.optString("source")).put("capturedAt", entry.optString("capturedAt")));
            }
            call.getData().put("exportPayload", new JSONObject().put("title", "Melforia · Digitaler Schutz").put("exportedAt", new Date().toString())
                .put("note", "Persönliche Textsammlung. Keine verifizierten Originalnachweise, keine Screenshots und keine verifizierten Profilzuordnungen. capturedAt ist der Sicherungszeitpunkt. example und native-demo bezeichnen erfundene Beispiele.").put("entries", entries).toString(2));
            Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("application/json")
                .putExtra(Intent.EXTRA_TITLE, "melforia-schutz.json");
            startActivityForResult(call, intent, "collectionSaved");
        } catch (Exception exception) { call.reject("Der Export konnte nicht vorbereitet werden."); }
    }
    @ActivityCallback private void collectionSaved(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null || result.getData().getData() == null) { call.resolve(); return; }
        try (OutputStream output = getContext().getContentResolver().openOutputStream(result.getData().getData(), "wt")) {
            if (output == null) throw new IllegalStateException("No file handle");
            output.write(call.getData().getString("exportPayload").getBytes(StandardCharsets.UTF_8)); call.resolve();
        } catch (Exception exception) { call.reject("Die Datei konnte nicht gespeichert werden."); }
    }
}
