package io.github.pahnini.melforia;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import io.github.pahnini.melforia.protection.ProtectionPlugin;

public class MainActivity extends BridgeActivity {
    @Override public void onCreate(Bundle savedInstanceState) {
        registerPlugin(ProtectionPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
