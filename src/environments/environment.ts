// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {

    production: false,
    liveQuizNegativeMark: .25,
    tenantname:'careNext',
    questionMarks: 4,
    //  apiURL: "http://192.168.1.10/api/v1",  
    apiURL: "https://api.adrplexus.com/college-admin/api/v1",  
    // dynmoDB:"https://z0p411vwsa.execute-api.ap-south-1.amazonaws.com/dev",
    //  externalApiURL: "http://192.168.1.10",
   externalApiURL: "https://api.adrplexus.com/college-admin",
    tenantvalidateURl: "https://api.adrplexus.com/saas-admin-dev",
    OAuthConfiguration: {
      ApiClientID: "a2db852e6f28416f925dddeece5bfa96",
      ApiUserName: "elms",
      ApiPassword: "elms@123",
      ApiGrantType: "password"
    },
    supportedCountryCode: ["+91"]
  };
  export const AppSyncenvironment = {
    production: false,
    API_KEY: 'da2-luvbj56kcjbknppwbdm3rc4m3i',
    host: 'https://h24veioscjamzjfidk6ryphv2a.appsync-api.ap-south-1.amazonaws.com/graphql'
  };
  
  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
  

