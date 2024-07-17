use kanidm_client::{ClientError, KanidmClient};

pub fn gen_client(url: String, insecure_mode: bool) -> Result<KanidmClient, ClientError> {
    kanidm_client::KanidmClientBuilder::new()
        .address(url)
        .connect_timeout(15)
        .danger_accept_invalid_certs(insecure_mode)
        .danger_accept_invalid_hostnames(insecure_mode)
        .build()
}

pub fn connect_with_key(client: KanidmClient, key: String) {
    client.
}
