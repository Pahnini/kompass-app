package io.github.pahnini.melforia.protection;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import io.github.pahnini.melforia.R;

/** A native fixture where the actual AccessibilityService can be checked without Instagram. */
public class ProtectionDemoActivity extends Activity {
    static volatile boolean visible;
    private int dp(int value) { return Math.round(value * getResources().getDisplayMetrics().density); }
    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        LinearLayout page = new LinearLayout(this); page.setOrientation(LinearLayout.VERTICAL); page.setPadding(dp(20), dp(34), dp(20), dp(30)); page.setBackgroundColor(Color.rgb(241, 246, 237));
        TextView heading = new TextView(this); heading.setText("Melforia · echtes Overlay testen"); heading.setTextSize(23); heading.setTextColor(Color.rgb(30, 65, 48)); page.addView(heading);
        TextView info = new TextView(this); info.setText("Erfundene Kommentare. Der schwebende Schutzbutton und die Abdeckungen werden vom Android-Dienst gezeichnet. Die Erkennung kann verzögert sein. Scrolle und prüfe, ob die Abdeckungen an der richtigen Stelle bleiben."); info.setTextSize(13); info.setPadding(0, dp(15), 0, dp(17)); page.addView(info);
        Button back = new Button(this); back.setText("Zurück zu Melforia"); back.setOnClickListener(view -> finish()); page.addView(back);
        ScrollView scroll = new ScrollView(this); LinearLayout comments = new LinearLayout(this); comments.setOrientation(LinearLayout.VERTICAL);
        String[] texts = { "Danke für diesen schönen Beitrag.", "Frauen haben in diesem Sport nichts verloren.", "Ich sehe das anders, aber schön, dass es dir hilft.", "Mit so einem Körper solltest du dich verstecken.", "Du bist einfach nur dumm.", "Ein bisschen Meer und eine kleine Pause.", "Du nervst.", "Danke für die Tipps.", "Ich werde dir wehtun.", "Ein sachlicher anderer Standpunkt." };
        for (int i = 0; i < texts.length; i++) {
            LinearLayout card = new LinearLayout(this); card.setOrientation(LinearLayout.VERTICAL); card.setPadding(dp(12), dp(22), dp(12), dp(26));
            TextView author = new TextView(this); author.setText("Beispielprofil " + (i + 1)); author.setTextSize(11); author.setTextColor(Color.rgb(90, 111, 85)); card.addView(author);
            TextView comment = new TextView(this); comment.setId(R.id.protection_demo_comment); comment.setText(texts[i]); comment.setTextSize(16); comment.setTextColor(Color.rgb(35, 61, 42)); comment.setPadding(0, dp(6), 0, dp(10)); card.addView(comment);
            TextView footer = new TextView(this); footer.setText("Erfundener Text · keine echte Veröffentlichung"); footer.setTextSize(10); card.addView(footer); comments.addView(card);
        }
        scroll.addView(comments); page.addView(scroll, new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, 0, 1)); setContentView(page);
    }
    @Override protected void onResume() { super.onResume(); visible = true; getWindow().getDecorView().postDelayed(ProtectionAccessibilityService::refresh, 120); }
    @Override protected void onPause() { visible = false; ProtectionAccessibilityService.refresh(); super.onPause(); }
}
