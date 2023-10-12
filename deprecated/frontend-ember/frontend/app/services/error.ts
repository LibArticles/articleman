import Service from '@ember/service';

export default class ErrorService extends Service {
  throw(error: string, severity: string) {
    
  }

  type = {
    backend: {
      google: {
        rateLimit: "backend.google.rateLimit",
        serverError: "backend.google.serverError",
        authorization: "backend.google.authorization",
        missingIdentity: "backend.google.missingIdentity",
      },
      developer: {
        badCustomBuild: "backend.developer.badCustomBuild",

      },
      datasets: {
        notFound: "backend.datasets.notFound",
        badType: "backend.datasets.badType",
        badFormat: "backend.datasets.badFormat",
      },
      api: {
        versionMismatch: "backend.api.versionMismatch",
        badFormat: "backend.api.badFormat",
        unknownEndpoint: "backend.api.unknownEndpoint",
      }
    },
    comms: {
      transport: {
        unreachable: "comms.transport.unreachable",
        timeout: "comms.transport.timeout",
        badURL: "comms.transport.badURL",
        badResponse: "comms.transport.badResponse",
      }
    },
    licensing: {
      missingSubscription: "licensing.missingSubscription",
      agplViolation: "licensing.agplViolation",
      licenseExpired: "licensing.expired",
      fakeLicense: "licensing.fakeLicense",
      invalidLicense: "licensing.invalidLicense",
      licenseDoesNotCoverFeature: "licensing.licenseDoesNotCoverFeature",
      licenseDoesNotCoverVersion: "licensing.licenseDoesNotCoverVersion",
      errorVerifyingLicense: "licensing.errorVerifyingLicense",
      licenseRevoked: "licensing.licenseRevoked",
      
    },
    developer: {
      badCustomBuild: "developer.badCustomBuild",
      cannotFetchClient: "developer.cannotFetchClient",
      unrecognizedCommand: "developer.unrecognizedCommand",
    },
    meta: {
      endOfLife: "meta.endOfLife",
      needsUpdate: "meta.needsUpdate",
      vulnerabilityWarning: "meta.vulnerabilityWarning",
    }
  }
  severity = {
    permadeath: "permadeath",
    needsRepair: "needsRepair",
    needsConfigChange: "needsConfigChange",
    needsRestart: "needsRestart",
    askForRetry: "askForRetry",
    automaticRetry: "automaticRetry",

  }
}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:error')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('error') declare altName: ErrorService;`.
declare module '@ember/service' {
  interface Registry {
    'error': ErrorService;
  }
}
