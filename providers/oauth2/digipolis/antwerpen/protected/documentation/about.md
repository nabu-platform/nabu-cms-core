For dev the endpoint is:

- :api store: https://api-store-o.antwerpen.be/
- :login: https://api-oauth2-o.antwerpen.be/v1/authorize?service=AStad.AProfiel.v1
- :token: https://api-gw-o.antwerpen.be/astad/aprofiel/v1/oauth2/token

For qlty the endpoint is (supposedly):

- :api store: https://api-store-a.antwerpen.be/
- :login: https://api-oauth2-a.antwerpen.be/v1/authorize?service=AStad.AProfiel.v1
- :token: https://api-gw-a.antwerpen.be/astad/aprofiel/v1/oauth2/token

For prd the endpoint is:

- :login: https://api-oauth2.antwerpen.be/v1/authorize?service=AStad.AProfiel.v1
- :token: https://api-gw-p.antwerpen.be/astad/aprofiel/v1/oauth2/token

More information in this [github project](https://github.com/digipolisantwerp/demo-oauth2-consumer_app_nodejs) though the mentioned [developer page](https://developer.antwerpen.be/) is not up yet, you can request access to the AProfile using the [api store](https://api-store-o.antwerpen.be/#/org/int-hifluence/dash/applications) for the respective environments.

You can create profiles for the environments using:

- :dev: https://www.dev.dcs.antwerpen.be/
- :qlty: https://www.acc.dcs.antwerpen.be/

Dev account:

- hilex
- Hifluence1

**Note**: they follow the POST method of using oauth2 for the token request but they do **not** allow a redirect uri to be sent along. You will get an error back stating ``Invalid redirect_uri that does not match with the one created with the application``. This misleading error is gone if you simply don't send a redirect uri in the request. Configuration toggle was added to allow you to configure this.

Interesting link for additional profile data (?): https://www.dev.dcs.antwerpen.be/srv/user/d/me

Rijksregisternummer only available if account created with eid.

tickets:
- profile id
- aanvraag id
- description
- status
zie antwerpen site (mijn aanvragen)