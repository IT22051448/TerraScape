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
      

      const userDataToStore = {
        token: result.userData.token,
        userData: {
          uid: userData.uid,
          fullName: userData.fullName,
          email: userData.email,
          role: userData.role,
        },
      };

      dispatch(authenticate(userDataToStore));

      setError(null);
      setIsLoading(false);

      // Navigate based on user role
      if (userData.role === "ServiceProvider") {
        navigation.navigate("ServiceProviderHome", {
          fullName: userData.fullName,
          userRole: userData.role,
        });
      } else {
        navigation.navigate("Main");
      }
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
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView
        style={{ flex: 1, padding: 16 }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        {/* Grey Box for Inputs and Title */}
        <View style={styles.inputContainer}>
          <Text
            style={{
              color: "black",
              fontSize: 37,
              fontWeight: "700",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            Sign In
          </Text>
          <Text
            style={{
              color: "black",
              fontSize: 15,
              fontWeight: "400",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              marginBottom: 10,
            }}
          >
            <View style={{ flex: 1 }}>
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
              style={{ position: "absolute", right: 15, top: 25 }}
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
            style={{
              margin: 10,
              backgroundColor: "white",
              borderColor: "white",
            }}
          />
          <View style={styles.bottomContainer}>
            <Text style={{ fontSize: 12, color: "black", fontWeight: "400" }}>
              Don't have an Account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={{ fontSize: 14, fontWeight: "800", color: "black" }}>
                {" "}
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "rgba(240, 240, 240, 1)", // Lighter grey with transparency
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  centeredButton: {
    justifyContent: "flex-end",
    alignItems: "baseline",
    bottom: 10,
    left: 20,
  },
});

export default SignIn;
