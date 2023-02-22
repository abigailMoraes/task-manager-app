
export const environment = {
  production: false,
  auth:{
  domain:"dev-1s03p1sl.us.auth0.com",
  clientId:"hvTrySattMvrkPBHVKIGu17EI67K36cb",
  redirectUri:window.location.origin,
  additionalSignUpFields: [{
    name: "given_name",
    placeholder: "Enter your First Name",
    storage: "root",
    validator: function(first_name: string | any[]) {
        return {
            valid: first_name.length >= 0,
            hint: "Must have 1 or more characters"
        };
    }
},{
    name: "family_name",
    placeholder: "Enter your Last Name",
    storage: "root",
    validator: function(family_name: string | any[]) {
        return {
            valid: family_name.length >= 0,
            hint: "Must have 1 or more characters"
        };
    }
}]
  }
  
};

