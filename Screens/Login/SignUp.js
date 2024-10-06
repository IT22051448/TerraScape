import React, { useReducer, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import AntDesign from "react-native-vector-icons/AntDesign";
import { signUp } from "../../utils/actions/authActions";
import { Picker } from "@react-native-picker/picker";

const initialState = {
  inputValues: {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Customer",
  },
  inputValidities: {
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
    role: true,
  },
  formIsValid: false,
};

const reducer = (state, action) => {
  const { validationResult, inputId, inputValue } = action;

  const updatedValues = {
    ...state.inputValues,
    [inputId]: inputValue,
  };

  const updatedValidities = {
    ...state.inputValidities,
    [inputId]: validationResult,
  };

  let updatedFormIsValid = true;
  for (const key in updatedValidities) {
    if (updatedValidities[key] !== true) {
      updatedFormIsValid = false;
      break;
    }
  }

  return {
    inputValues: updatedValues,
    inputValidities: updatedValidities,
    formIsValid: updatedFormIsValid,
  };
};

const SignUp = () => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const validateInput = (inputId, inputValue) => {
    switch (inputId) {
      case "fullName":
        return inputValue.trim().length > 0 ? true : "Name is required";
      case "email":
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(inputValue) ? true : "Invalid email format";
      case "password":
        return inputValue.length >= 6
          ? true
          : "Password must be at least 6 characters";
      case "confirmPassword":
        return inputValue === formState.inputValues.password
          ? true
          : "Passwords do not match";
      case "role":
        return inputValue.trim().length > 0 ? true : "Role is required";
      default:
        return true;
    }
  };

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const validationResult = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: validationResult || null,
        inputValue,
      });
    },
    [formState.inputValues.password]
  );

  const authHandler = async () => {
    try {
      if (
        formState.inputValues.password !== formState.inputValues.confirmPassword
      ) {
        Alert.alert("Passwords do not match!");
        return;
      }

      setIsLoading(true);
      const action = signUp(
        formState.inputValues.fullName,
        formState.inputValues.email,
        formState.inputValues.password,
        formState.inputValues.role
      );

      await dispatch(action);
      setError(null);
      Alert.alert("Account Successfully created", "Account created");
      setIsLoading(false);
      navigation.navigate("SignIn");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred", error);
    }
  }, [error]);

  return (
    <ImageBackground
      source={require("../../assets/images/background1.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={{ flex: 1 }}
      >
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>
            Signup now for free and start learning, and explore language.
          </Text>
          <CustomInput
            id="fullName"
            value={formState.inputValues.fullName}
            placeholder="Name"
            placeholderTextColor="gray"
            errorText={formState.inputValidities.fullName || null}
            onInputChanged={inputChangedHandler}
          />
          <CustomInput
            id="email"
            value={formState.inputValues.email}
            placeholder="Email Address"
            placeholderTextColor="gray"
            errorText={formState.inputValidities.email || null}
            onInputChanged={inputChangedHandler}
          />

          <View style={styles.rolePicker}>
            <Text style={{ color: "black", marginBottom: 5 }}>Role:</Text>
            <Picker
              selectedValue={formState.inputValues.role}
              onValueChange={(itemValue) => {
                inputChangedHandler("role", itemValue);
              }}
              style={{
                height: 50,
                width: "100%",
                color: "black",
                backgroundColor: "lightgray",
              }}
            >
              <Picker.Item label="Customer" value="Customer" />
              <Picker.Item label="Service Provider" value="ServiceProvider" />
            </Picker>
            {formState.inputValidities.role && (
              <Text style={{ color: "red" }}>
                {formState.inputValidities.role}
              </Text>
            )}
          </View>

          <View style={styles.passwordContainer}>
            <CustomInput
              id="password"
              value={formState.inputValues.password}
              placeholder="Password"
              placeholderTextColor="gray"
              secureTextEntry={!isPasswordVisible}
              errorText={formState.inputValidities.password || null}
              onInputChanged={inputChangedHandler}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!isPasswordVisible)}
              style={styles.eyeIcon}
            >
              <AntDesign
                name={isPasswordVisible ? "eye" : "eyeo"}
                size={20}
                color="black"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <CustomInput
              id="confirmPassword"
              value={formState.inputValues.confirmPassword}
              placeholder="Confirm Password"
              placeholderTextColor="gray"
              secureTextEntry={!isConfirmPasswordVisible}
              errorText={formState.inputValidities.confirmPassword || null}
              onInputChanged={inputChangedHandler}
            />
            <TouchableOpacity
              onPress={() =>
                setConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
              style={styles.eyeIcon}
            >
              <AntDesign
                name={isConfirmPasswordVisible ? "eye" : "eyeo"}
                size={20}
                color="black"
              />
            </TouchableOpacity>
          </View>

          <CustomButton
            title="Sign Up"
            onPress={authHandler}
            isLoading={isLoading}
            style={{
              margin: 10,
              backgroundColor: "white",
              borderColor: "white",
            }}
          />

          <View style={styles.bottomContainer}>
            <Text style={{ fontSize: 12, color: "black", fontWeight: "400" }}>
              Have an account already?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text style={{ fontSize: 14, fontWeight: "800", color: "black" }}>
                {" "}
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  inputContainer: {
    backgroundColor: "rgba(240, 240, 240, 0.9)", // Lighter grey with transparency
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
  },
  title: {
    color: "black",
    fontSize: 37,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "black",
    fontSize: 15,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 20,
  },
  rolePicker: {
    marginBottom: 20,
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 20,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 25,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  centeredButton: {
    bottom: 10,
    left: 20,
    justifyContent: "flex-end",
    alignItems: "baseline",
  },
});

export default SignUp;
