// app/(auth)/login.tsx
import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useDebugStorage } from "@/hooks/useDebugStore";
import { AuthCredentials } from "@/api/auth/auth.entity";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const {signIn} = useAuth();

  const router = useRouter();

  const handleLogin = async () => {
    console.log("Login button pressed");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      const credentials: AuthCredentials = { identifier: email, secret: password };
      console.log("Calling signIn with credentials:", credentials);

      const result = await signIn(credentials);

      if (result.isOk()) {
        console.log("Login successful");
        setEmail("");
        setPassword("");
        setError(null);

        router.replace("/(tabs)");
      } else {
        console.error("Login error:", result.unwrapErr());
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password");
    }
  };

  useDebugStorage();

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError(null);
        }}
        autoCapitalize="none"
        keyboardType="email-address"
        // editable={!isLoading}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setError(null);
        }}
        secureTextEntry
        // editable={!isLoading}
      />

      <TouchableOpacity
        style={[
          styles.button,
          // (!isValid || isLoading) && styles.buttonDisabled
        ]}
        onPress={handleLogin}
        // disabled={!isValid || isLoading}
      >
        <Text style={styles.buttonText}>
          {/* {isLoading ? "Logging in..." : "Login"} */}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "white",
  },
  button: {
    height: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: "#007AFF80",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
});
