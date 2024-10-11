import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { reducer } from "../../utils/reducers/formReducers";
import { validateInput } from "../../utils/actions/formActions";
import { useDispatch } from "react-redux";
import { signIn } from "../../utils/actions/authActions";
import AntDesign from "react-native-vector-icons/AntDesign";
import { getUserByEmail } from "../../utils/databases/firebaseDatabase";
import { authenticate } from "../../store/authSlice";
import { signOut } from "firebase/auth";

const initialState = {
  inputValues: {
    email: "",
    password: "",
  },
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false,
};

const SignIn = () => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [error, setError] = useState();
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result || null,
        inputValue,
      });
    },
    [dispatchFormState]
  );

  const authHandler = async () => {
    try {
      setIsLoading(true);
      const result = await dispatch(
        signIn(formState.inputValues.email, formState.inputValues.password)
      );

      const email = formState.inputValues.email;
      const userFromDb = await getUserByEmail(email);
      const userData = Object.values(userFromDb)[0];

      dispatch(
        authenticate({
          token: result.userData.token,
          userData: {
            uid: userData.uid,
            fullName: userData.fullName,
            email: userData.email,
            imageUrl: userData.imageUrl,
            role: userData.role,
          },
        })
      );

      setError(null);
      setIsLoading(false);

      navigation.navigate(
        userData.role === "ServiceProvider"
          ? "ServiceProviderHome"
          : "CustomerHome"
      );
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      if (error.code === "auth/network-request-failed") {
        await signOut();
      }
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred", error);
    }
  }, [error]);

  useFocusEffect(
    useCallback(() => {
      dispatchFormState({
        inputId: "email",
        validationResult: false,
        inputValue: "",
      });
      dispatchFormState({
        inputId: "password",
        validationResult: false,
        inputValue: "",
      });
      setError(null);
    }, [])
  );

  return (
    <ImageBackground
      source={require("../../assets/images/background1.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.mainTitle}>TERRASCAPE</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.signInTitle}>Sign In</Text>
          <Text style={styles.signInSubtitle}>
            Sign in now to access your account.
          </Text>

          <CustomInput
            id="email"
            value={formState.inputValues.email}
            placeholder="Email Address"
            placeholderTextColor="black"
            errorText={formState.inputValidities.email}
            onInputChanged={inputChangedHandler}
          />
          <View style={styles.passwordContainer}>
            <View style={styles.passwordInput}>
              <CustomInput
                id="password"
                value={formState.inputValues.password}
                placeholder="Password"
                placeholderTextColor="black"
                secureTextEntry={!isPasswordVisible}
                errorText={formState.inputValidities.password || null}
                onInputChanged={inputChangedHandler}
                style={{ width: "100%" }}
              />
            </View>
            <TouchableOpacity
              onPress={() => setPasswordVisible(!isPasswordVisible)}
              style={styles.passwordToggle}
            >
              <AntDesign
                name={isPasswordVisible ? "eye" : "eyeo"}
                size={20}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <CustomButton
            title="Sign In"
            onPress={authHandler}
            isLoading={isLoading}
            style={styles.signInButton}
          />
          <View style={styles.bottomContainer}>
            <Text style={styles.bottomText}>Don't have an Account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.signUpText}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Dark overlay for better text visibility
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
    marginBottom: 20,
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  inputContainer: {
    backgroundColor: "rgba(240, 240, 240, 1)",
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
  },
  signInTitle: {
    color: "black",
    fontSize: 37,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  signInSubtitle: {
    color: "black",
    fontSize: 15,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
  },
  passwordToggle: {
    position: "absolute",
    right: 15,
    top: 25,
  },
  signInButton: {
    margin: 10,
    backgroundColor: "white",
    borderColor: "white",
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40,
    marginHorizontal: 80,
  },
  bottomText: {
    fontSize: 12,
    color: "black",
    fontWeight: "400",
  },
  signUpText: {
    fontSize: 14,
    fontWeight: "800",
    color: "black",
  },
});

export default SignIn;
