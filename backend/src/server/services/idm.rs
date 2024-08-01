use kanidm_client::{ClientError, KanidmClient};
struct AMKaniClient {
    idm_client: KanidmClient,
}
impl AMKaniClient {
    pub async fn new(url: String, insecure_mode: bool) -> Result<AMKaniClient, ClientError> {
        match kanidm_client::KanidmClientBuilder::new()
            .address(url)
            .connect_timeout(15)
            .danger_accept_invalid_certs(insecure_mode)
            .danger_accept_invalid_hostnames(insecure_mode)
            .build()
        {
            Ok(client) => {
                Ok(AMKaniClient {
                    idm_client: client
                })
            }
            Err(err) => {
                tracing::error!("Failed to initialize the Kanidm client: {:?}", err);
                Err(err)
            }
        }
    }

    pub async fn connect_with_key(
        client: KanidmClient,
        token: String,
    ) -> Result<KanidmClient, AMKaniError> {
        client.set_token(token).await;
        match client.whoami().await {
            Ok(Some(acct_name)) => {
                tracing::info!(
                    "Authenticated with Kanidm, service account ID {}",
                    acct_name
                );
                Ok(client)
            }
            Ok(None) => {
                tracing::error!(
                "Couldn't authenticate with Kanidm, because this API token isn't authorized to connect. Make sure it's a valid API token for `{}`.", client.get_url()
            );
                Err(AMKaniError::NotAuthorizedError)
            }
            Err(err) => {
                tracing::error!(
                    "Kanidm authentication failed for an unrecognized reason: {:?}",
                    err
                );
                Err(AMKaniError::OtherError(err))
            }
        }
    }
}

pub enum AMKaniError {
    NotAuthorizedError,
    OtherError(ClientError),
}
