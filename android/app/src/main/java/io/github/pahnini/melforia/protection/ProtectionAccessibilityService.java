package io.github.pahnini.melforia.protection;

import android.accessibilityservice.AccessibilityService;
import android.app.KeyguardManager;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.graphics.Rect;
import android.graphics.drawable.GradientDrawable;
import android.os.Handler;
import android.os.Looper;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;
import android.view.accessibility.AccessibilityWindowInfo;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import io.github.pahnini.melforia.MainActivity;
import io.github.pahnini.melforia.R;

/** Opt-in, local, read-only comment inspection. No gestures, network, screenshots or account actions. */
public final class ProtectionAccessibilityService extends AccessibilityService {
    private static volatile ProtectionAccessibilityService instance;
    private static final String INSTAGRAM = "com.instagram.android";
    private final Handler handler = new Handler(Looper.getMainLooper());
    private final Runnable rescan = this::scan;
    private final List<View> covers = new ArrayList<>();
    private final Set<String> revealed = new HashSet<>();
    private ProtectionStore store;
    private ProtectionRuleEngine engine;
    private WindowManager windows;
    private ImageButton bubble;
    private WindowManager.LayoutParams bubblePosition;
    private LinearLayout panel;
    private int targetWindow = -1;
    private String signature = "";
    private boolean saveErrorShown;
    public static boolean isConnected() { return instance != null; }
    public static void refresh() { ProtectionAccessibilityService current = instance; if (current != null) current.handler.post(current.rescan); }
    @Override protected void onServiceConnected() {
        super.onServiceConnected();
        store = new ProtectionStore(this); windows = (WindowManager) getSystemService(WINDOW_SERVICE);
        try { engine = store.engine(); instance = this; scan(); }
        catch (Exception exception) { removeAll(); try { store.enable(false); } catch (Exception ignored) { /* Remain disconnected. */ } }
    }
    @Override public void onAccessibilityEvent(AccessibilityEvent event) {
        if (instance != this || event == null) return;
        String owner = event.getPackageName() == null ? "" : event.getPackageName().toString();
        if (!owner.isEmpty() && !INSTAGRAM.equals(owner) && !getPackageName().equals(owner)) {
            if (event.getEventType() == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) removeAll();
            handler.removeCallbacks(rescan); handler.postDelayed(rescan, 80); return;
        }
        // Changes in our overlay windows must not recursively recreate the overlays.
        if (getPackageName().equals(owner) && event.getWindowId() != targetWindow) {
            if (!ProtectionDemoActivity.visible) { removeAll(); return; }
            handler.removeCallbacks(rescan); handler.postDelayed(rescan, 80); return;
        }
        if (event.getEventType() == AccessibilityEvent.TYPE_VIEW_SCROLLED || event.getEventType() == AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED) {
            revealed.clear(); clearCovers();
        }
        handler.removeCallbacks(rescan); handler.postDelayed(rescan, 80);
    }
    private AccessibilityNodeInfo target() {
        KeyguardManager keyguard = (KeyguardManager) getSystemService(KEYGUARD_SERVICE);
        if (keyguard != null && keyguard.isKeyguardLocked()) return null;
        for (AccessibilityWindowInfo window : getWindows()) {
            if (window.getType() == AccessibilityWindowInfo.TYPE_ACCESSIBILITY_OVERLAY || window.getType() == AccessibilityWindowInfo.TYPE_INPUT_METHOD) continue;
            if (!window.isActive() && !window.isFocused()) continue;
            AccessibilityNodeInfo root = window.getRoot(); if (root == null) return null;
            String owner = root.getPackageName() == null ? "" : root.getPackageName().toString();
            if (INSTAGRAM.equals(owner) || (getPackageName().equals(owner) && ProtectionDemoActivity.visible)) { targetWindow = window.getId(); return root; }
            root.recycle(); return null;
        }
        return null;
    }
    private static final class Comment {
        final String text, category, source, key; final Rect bounds;
        Comment(String text, String category, String source, Rect bounds) {
            this.text = text; this.category = category; this.source = source; this.bounds = bounds;
            this.key = source + ":" + text + ":" + bounds.toShortString();
        }
    }
    private boolean isCommentNode(AccessibilityNodeInfo node) {
        AccessibilityNodeInfo current = node;
        boolean owned = false;
        for (int depth = 0; depth < 3 && current != null; depth++) {
            if (current.isEditable() || current.isPassword()) { if (owned) current.recycle(); return false; }
            String id = current.getViewIdResourceName();
            boolean matches = id != null && id.toLowerCase(Locale.ROOT).contains("comment");
            AccessibilityNodeInfo parent = matches ? null : current.getParent();
            if (owned) current.recycle();
            if (matches) return true;
            current = parent; owned = true;
        }
        if (owned && current != null) current.recycle();
        return false;
    }
    private void collect(AccessibilityNodeInfo node, List<Comment> matches, JSONObject config, String source, int[] visited, Rect viewport) {
        if (node == null || visited[0]++ > 350 || matches.size() >= 12) return;
        if (node.isVisibleToUser() && !node.isPassword() && !node.isEditable() && isCommentNode(node)) {
            // Text is accessed only after the comment/resource and editable-field checks.
            CharSequence value = node.getText();
            if (value != null && value.length() > 0 && value.length() <= 500) {
                String text = value.toString(); String category = store.assess(engine, text, config);
                if (category != null) {
                    Rect bounds = new Rect(); node.getBoundsInScreen(bounds);
                    if (bounds.intersect(viewport) && bounds.width() > dp(90) && bounds.height() >= dp(8)) {
                        Comment match = new Comment(text, category, source, bounds);
                        boolean duplicate = false; for (Comment previous : matches) if (previous.key.equals(match.key)) duplicate = true;
                        if (!duplicate) matches.add(match);
                    }
                }
            }
        }
        for (int i = 0; i < node.getChildCount(); i++) {
            AccessibilityNodeInfo child = node.getChild(i);
            if (child != null) { collect(child, matches, config, source, visited, viewport); child.recycle(); }
        }
    }
    private void scan() {
        if (engine == null || windows == null) return;
        AccessibilityNodeInfo root = null;
        try {
            root = target();
            if (root == null || store.snapshot().optInt("consentVersion") != 1) { removeAll(); return; }
            JSONObject config = store.config(); List<Comment> matches = new ArrayList<>();
            if (store.enabled()) {
                Rect viewport = new Rect(); root.getBoundsInScreen(viewport);
                viewport.intersect(dp(4), dp(28), screenWidth() - dp(4), screenHeight() - dp(28));
                String source = INSTAGRAM.contentEquals(root.getPackageName()) ? "instagram" : "native-demo";
                collect(root, matches, config, source, new int[] {0}, viewport);
            }
            StringBuilder next = new StringBuilder(store.enabled() ? "on" : "off");
            for (Comment comment : matches) if (!revealed.contains(comment.key)) next.append(comment.key);
            if (!signature.equals(next.toString())) {
                clearCovers();
                for (Comment comment : matches) if (!revealed.contains(comment.key)) addCover(comment);
                signature = next.toString();
                raiseBubble();
            }
            showBubble();
            if (store.enabled() && config.optBoolean("autoCollect")) for (Comment comment : matches) {
                try { store.save(comment.text, comment.category, comment.source, true); }
                catch (Exception exception) { if (!saveErrorShown) { saveErrorShown = true; toast("Ein Text konnte nicht gespeichert werden."); } }
            }
        } catch (Exception exception) { removeAll(); }
        finally { if (root != null) root.recycle(); }
    }
    private int dp(float value) { return Math.round(value * getResources().getDisplayMetrics().density); }
    private int screenWidth() { return getResources().getDisplayMetrics().widthPixels; }
    private int screenHeight() { return getResources().getDisplayMetrics().heightPixels; }
    private GradientDrawable background(int color, int radius) {
        GradientDrawable shape = new GradientDrawable(); shape.setColor(color); shape.setCornerRadius(dp(radius)); shape.setStroke(dp(1), Color.rgb(116, 155, 122)); return shape;
    }
    private WindowManager.LayoutParams layout(int width, int height, int x, int y) {
        WindowManager.LayoutParams params = new WindowManager.LayoutParams(width, height, WindowManager.LayoutParams.TYPE_ACCESSIBILITY_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE | WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL | WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN, PixelFormat.TRANSLUCENT);
        params.gravity = Gravity.TOP | Gravity.START; params.x = x; params.y = y; return params;
    }
    private String label(String category) {
        switch (category) { case "sexism": return "Sexismus"; case "body": return "Bodyshaming"; case "harassment": return "Belästigung"; case "threat": return "Drohung"; case "custom": return "Wortregel"; default: return "Beleidigung"; }
    }
    private Button button(String title, Runnable action) {
        Button button = new Button(this); button.setText(title); button.setTextSize(11); button.setAllCaps(false); button.setTextColor(Color.WHITE);
        button.setMinHeight(dp(44)); button.setMinimumHeight(dp(44)); button.setMinimumWidth(0); button.setMinWidth(0); button.setPadding(dp(8), dp(2), dp(8), dp(2));
        button.setBackgroundColor(Color.TRANSPARENT); button.setOnClickListener(view -> action.run()); return button;
    }
    private void addCover(Comment comment) {
        LinearLayout cover = new LinearLayout(this); cover.setOrientation(LinearLayout.VERTICAL); cover.setPadding(dp(9), dp(3), dp(7), dp(2)); cover.setBackground(background(Color.rgb(28, 72, 53), 10));
        TextView title = new TextView(this); title.setText("Verdeckt · " + label(comment.category)); title.setTextColor(Color.rgb(227, 244, 219)); title.setTextSize(11); title.setMaxLines(1); cover.addView(title);
        LinearLayout actions = new LinearLayout(this); actions.setOrientation(LinearLayout.HORIZONTAL);
        actions.addView(button("Anzeigen", () -> { revealed.add(comment.key); remove(cover); covers.remove(cover); signature = ""; handler.post(rescan); }), new LinearLayout.LayoutParams(0, dp(44), 1));
        actions.addView(button("Sichern", () -> { try { toast(store.save(comment.text, comment.category, comment.source, false) ? "Text lokal gesichert." : "Bereits gesichert oder Sammlung voll."); } catch (Exception exception) { toast("Text konnte nicht gespeichert werden."); } }), new LinearLayout.LayoutParams(0, dp(44), 1));
        cover.addView(actions);
        int width = Math.min(Math.max(comment.bounds.width() + dp(8), dp(180)), screenWidth() - dp(16));
        int x = Math.max(dp(8), Math.min(comment.bounds.left - dp(4), screenWidth() - width - dp(8)));
        int height = Math.max(dp(68), comment.bounds.height() + dp(8));
        height = Math.min(height, screenHeight() - dp(80));
        int y = Math.max(dp(28), Math.min(comment.bounds.top - dp(3), screenHeight() - height - dp(28)));
        windows.addView(cover, layout(width, height, x, y)); covers.add(cover);
    }
    private void showBubble() {
        if (bubble != null) { bubble.setContentDescription(store.enabled() ? "Melforia Schutz aktiv. Menü öffnen" : "Melforia Schutz pausiert. Menü öffnen"); return; }
        bubble = new ImageButton(this); bubble.setImageResource(R.drawable.protection_shield); bubble.setBackground(background(Color.rgb(23, 62, 47), 18)); bubble.setElevation(dp(8));
        bubblePosition = layout(dp(56), dp(56), screenWidth() - dp(76), screenHeight() - dp(136));
        bubble.setOnClickListener(view -> openPanel());
        bubble.setOnTouchListener(new View.OnTouchListener() {
            float startX, startY; int x, y; boolean moved;
            @Override public boolean onTouch(View view, MotionEvent event) {
                switch (event.getActionMasked()) {
                    case MotionEvent.ACTION_DOWN: startX = event.getRawX(); startY = event.getRawY(); x = bubblePosition.x; y = bubblePosition.y; moved = false; return true;
                    case MotionEvent.ACTION_MOVE:
                        float dx = event.getRawX() - startX, dy = event.getRawY() - startY;
                        if (Math.abs(dx) + Math.abs(dy) > dp(7)) moved = true;
                        if (moved) { closePanel(); bubblePosition.x = Math.max(dp(8), Math.min(screenWidth() - dp(64), x + (int) dx)); bubblePosition.y = Math.max(dp(30), Math.min(screenHeight() - dp(90), y + (int) dy)); windows.updateViewLayout(view, bubblePosition); }
                        return true;
                    case MotionEvent.ACTION_UP: if (!moved) view.performClick(); return true;
                    default: return true;
                }
            }
        });
        windows.addView(bubble, bubblePosition);
        bubble.setContentDescription(store.enabled() ? "Melforia Schutz aktiv. Menü öffnen" : "Melforia Schutz pausiert. Menü öffnen");
    }
    private void raiseBubble() { if (bubble != null) { remove(bubble); windows.addView(bubble, bubblePosition); } if (panel != null) { LinearLayout old = panel; closePanel(); if (old != null) openPanel(); } }
    private void openPanel() {
        if (panel != null) { closePanel(); return; }
        panel = new LinearLayout(this); panel.setOrientation(LinearLayout.VERTICAL); panel.setPadding(dp(15), dp(12), dp(15), dp(12)); panel.setBackground(background(Color.rgb(24, 57, 45), 16));
        TextView title = new TextView(this); title.setText("Melforia · Digitaler Schutz"); title.setTextSize(15); title.setTextColor(Color.WHITE); panel.addView(title);
        panel.addView(button(store.enabled() ? "Schutz pausieren" : "Schutz starten", () -> { try { store.enable(!store.enabled()); } catch (Exception exception) { toast("Aktivierung nicht möglich."); } closePanel(); signature = ""; handler.post(rescan); }));
        panel.addView(button("Sammlung in Melforia öffnen", () -> { closePanel(); startActivity(new Intent(this, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP)); }));
        panel.addView(button("Menü schließen", this::closePanel));
        int width = Math.min(dp(270), screenWidth() - dp(24));
        windows.addView(panel, layout(width, WindowManager.LayoutParams.WRAP_CONTENT, Math.max(dp(12), screenWidth() - width - dp(12)), Math.max(dp(35), screenHeight() - dp(340))));
    }
    private void toast(String text) { Toast.makeText(this, text, Toast.LENGTH_SHORT).show(); }
    private void remove(View view) { if (windows != null && view != null) try { windows.removeViewImmediate(view); } catch (IllegalArgumentException ignored) { /* Already detached. */ } }
    private void clearCovers() { for (View cover : covers) remove(cover); covers.clear(); signature = ""; }
    private void closePanel() { remove(panel); panel = null; }
    private void removeAll() { clearCovers(); closePanel(); remove(bubble); bubble = null; targetWindow = -1; revealed.clear(); }
    @Override public void onInterrupt() { handler.removeCallbacks(rescan); removeAll(); try { store.enable(false); } catch (Exception ignored) { /* All windows are already removed. */ } }
    @Override public boolean onUnbind(Intent intent) { shutdown(); return super.onUnbind(intent); }
    @Override public void onDestroy() { shutdown(); super.onDestroy(); }
    private void shutdown() { if (instance == this) instance = null; handler.removeCallbacksAndMessages(null); removeAll(); if (store != null) try { store.enable(false); } catch (Exception ignored) { /* No active service remains. */ } }
}
