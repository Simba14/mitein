/* eslint-disable class-methods-use-this */
import { GraphQLExtension } from "graphql-extensions";
// import _ from "lodash/fp.js";
import { log } from "./logger.js";

// const graphqlOperationsRegex = /((mutation )|(query )|(subscription ))(\w)+(\(|\s|\{)/g;
//
// const sensitiveVariablesRegex = /pass|email/i;

// const isSensitiveKey = variable => {
//   return variable.match(sensitiveVariablesRegex);
// };

// const maskSensitiveData = variables => {
//   if (variables && typeof variables === "object") {
//     for (const [key, value] of Object.entries(variables)) {
//       if (isSensitiveKey(key)) {
//         // eslint-disable-next-line no-param-reassign
//         variables[key] = "**********";
//       }
//
//       if (typeof value === "object") {
//         maskSensitiveData(value);
//       }
//     }
//   }
//
//   return variables;
// };

const logError = error => {
  const errorToLog = {
    ...error,
    metadata: {
      ...error.metadata
      // graphqlVariables: maskSensitiveData(error.metadata.graphqlVariables)
    }
  };

  log(errorToLog, "error");
};

class ErrorFormatter extends GraphQLExtension {
  willSendResponse(o) {
    const { context, graphqlResponse } = o;

    if (graphqlResponse.errors) {
      // const cfRayId = get('req.headers[cf-ray]', context);
      // const graphqlQuery = get('req.body.query', context);
      // const graphqlVariables = get('req.body.variables', context);
      // const graphqlOperations = graphqlQuery.match(graphqlOperationsRegex);
      //
      // const metadata = {
      //   ...(cfRayId && { cfRayId }),
      //   ...(graphqlQuery && { graphqlQuery }),
      //   ...(graphqlVariables && { graphqlVariables }),
      //   ...(graphqlOperations && { graphqlOperations: graphqlOperations.map(opName => opName.slice(0, -1)) }),
      // };
      const metadata = {};

      graphqlResponse.errors = graphqlResponse.errors.map(error => {
        const errorWithMetadata = { ...error, metadata };
        logError(errorWithMetadata);

        return errorWithMetadata;
      });
    }

    return o;
  }
}

export default ErrorFormatter;
