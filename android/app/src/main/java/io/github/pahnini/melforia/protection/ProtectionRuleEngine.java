package io.github.pahnini.melforia.protection;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;

/** Pure Java counterpart of src/utils/protection.ts; uses the same rule asset. */
public final class ProtectionRuleEngine {
    public static final class Rule {
        final String category;
        final int severity;
        final Pattern pattern;
        public Rule(String category, int severity, String expression) {
            this.category = category;
            this.severity = severity;
            this.pattern = Pattern.compile(expression, Pattern.UNICODE_CHARACTER_CLASS);
        }
    }
    private final List<Rule> rules;
    public ProtectionRuleEngine(List<Rule> rules) { this.rules = rules; }
    public static String normalize(String text) {
        return Normalizer.normalize(text, Normalizer.Form.NFKC).toLowerCase(Locale.GERMAN)
            .replaceAll("[\\u200B-\\u200D\\uFEFF]", "").replaceAll("(?U)\\s+", " ").trim();
    }
    public String assess(String input, String level, Set<String> categories, List<String> customWords) {
        String text = normalize(input.substring(0, Math.min(input.length(), 500)));
        for (String word : customWords) if (!word.trim().isEmpty() && text.contains(normalize(word))) return "custom";
        int minimum = "gentle".equals(level) ? 3 : "strict".equals(level) ? 1 : 2;
        for (Rule rule : rules) if (rule.severity >= minimum && categories.contains(rule.category) && rule.pattern.matcher(text).find()) return rule.category;
        return null;
    }
}
