# Description
A modular e-commerce application, implementing the specification, defined [here](#).

**Note:** this is a *sketch*, which means it doesn't even work yet - apart from the controllers in `store`, which you can [test](#test-store).

# Api
## Function
### Inward
Api transmits the received data over to the store. In doing so, it should make sure that:
1. fields, defined [here](#) exist in the received data
2. the values are of the correct type
3. fields, not defined in the [spec](#), don't exist

### Outward
Assign status codes and messages to the output of the store and send it in response to the client.

# Store
Store needs to implement the interface, defined [here](#).

# App
[The app](#) bundles everything together and deploys it.

# Test store
```bash
git clone <clone url>
cd <cloned directory>/store
npm run test
```
