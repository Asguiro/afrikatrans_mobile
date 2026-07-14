# AfrikaTrans release ProGuard / R8 rules.
# React Native + Hermes keep rules are applied by the RN Gradle plugin.

# Keep native bridge / reflection used by RN libraries.
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Prefer soft fails over crash on missing optional classes from deps.
-dontwarn com.facebook.react.**
-dontwarn com.facebook.hermes.**
