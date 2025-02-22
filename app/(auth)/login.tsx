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
import { AuthCredentials } from "@/api/auth/domain/auth.entity";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { signIn, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("please enter email and password");
      return;
    }

    const credentials: AuthCredentials = {
      identifier: email,
      secret: password,
    };

    const result = await signIn(credentials);

    if (result.isErr()) {
      const error = result.unwrapErr();

      setError(error.message);
      return;
    }
  };

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
