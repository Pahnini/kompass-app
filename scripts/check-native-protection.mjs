import { readFileSync, writeFileSync, mkdtempSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const rules = JSON.parse(
  readFileSync(new URL('../public/protection-rules.json', import.meta.url), 'utf8')
);
const fixtures = JSON.parse(
  readFileSync(new URL('../public/protection-fixtures.json', import.meta.url), 'utf8')
);
const literal = value => JSON.stringify(value);
const directory = mkdtempSync(join(tmpdir(), 'melforia-protection-check-'));
try {
  const source = `import io.github.pahnini.melforia.protection.ProtectionRuleEngine;
import java.util.*;
public class ProtectionParityCheck {
  public static void main(String[] args) {
    ProtectionRuleEngine engine = new ProtectionRuleEngine(Arrays.asList(${rules.map(rule => `new ProtectionRuleEngine.Rule(${literal(rule.category)},${rule.severity},${literal(rule.pattern)})`).join(',')}));
    ${fixtures
      .map(
        (fixture, index) => `{
      Set<String> enabled = new HashSet<>(Arrays.asList("sexism","insult","body","harassment","threat"));
      ${fixture.disabled ? `enabled.remove(${literal(fixture.disabled)});` : ''}
      String actual = engine.assess(${literal(fixture.text)},${literal(fixture.level ?? 'balanced')},enabled,Arrays.asList(${(fixture.customWords ?? []).map(literal).join(',')}));
      if (!Objects.equals(actual,${fixture.expected === null ? 'null' : literal(fixture.expected)})) throw new AssertionError("Native/web fixture ${index + 1} differs: " + actual);
    }`
      )
      .join('\n')}
    System.out.println("Native rule engine: ${fixtures.length} shared fixtures passed.");
  }
}`;
  const file = join(directory, 'ProtectionParityCheck.java');
  writeFileSync(file, source);
  mkdirSync(join(directory, 'classes'));
  const compilerArgs = [
    '-d',
    join(directory, 'classes'),
    resolve(
      'android/app/src/main/java/io/github/pahnini/melforia/protection/ProtectionRuleEngine.java'
    ),
    file,
  ];
  const hasJavac = !spawnSync('javac', ['-version']).error;
  execFileSync(
    hasJavac ? 'javac' : 'java',
    hasJavac
      ? compilerArgs
      : ['--add-modules', 'jdk.compiler', 'com.sun.tools.javac.Main', ...compilerArgs],
    { stdio: 'inherit' }
  );
  execFileSync('java', ['-cp', join(directory, 'classes'), 'ProtectionParityCheck'], {
    stdio: 'inherit',
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
