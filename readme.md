# Description
A modular e-commerce application, implementing the specification, defined [here](#).

# Api
## Function
### Inward
Api transmits the received data over to the store. In doing so, it should make sure that:
1. fields, defined in [here](#) exist in the received data
2. the values are of the correct type
3. fields, not defined in the spec, don't exist

### Outward
Assign status codes and messages to the output of the store and send it in response to the client.

# Store
Store needs to implement the interface, defined [here](#).
