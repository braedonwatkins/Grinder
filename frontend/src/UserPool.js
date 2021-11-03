import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-2_34v9YRHja",
  ClientId: "7g9lb8lj0jvgdnrpv495fbmjo8",
};

export default new CognitoUserPool(poolData);
