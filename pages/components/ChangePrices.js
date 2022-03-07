import React, { useState, useCallback } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { TextField, Layout, Button, Banner, Toast, Stack, Frame } from '@shopify/polaris';

// GraphQL mutation that updates the prices of products
const UPDATE_PRICE = gql`
  mutation productVariantUpdate($input: ProductVariantInput!) {
    productVariantUpdate(input: $input) {
      product {
        title
      }
      productVariant {
        id
        price
      }
    }
  }
`;

class ChangePrices extends React.Component {
  render() {
    return ( // Uses mutation's input to update product prices
      <Mutation mutation={UPDATE_PRICE}>
        {(handleSubmit, {error, data}) => {
          const [hasResults, setHasResults] = useState(false);

          const showError = error && (
            <Banner status="critical">{error.message}</Banner>
          );

          const showToast = hasResults && (
            <Toast
              content="Successfully updated"
              onDismiss={() => setHasResults(false)}
            />
          );

          const [textFieldValue, setTextFieldValue] = useState('50');

          const handleTextFieldChange = useCallback(
            (value) => setTextFieldValue(value),
            [],
          );

          return (
            <Frame>
              {showToast}
              <Layout.Section>
              <TextField
                label="Price"
                type="number"
                value={textFieldValue}
                onChange={handleTextFieldChange}
                prefix="$"
                autoComplete="off"
              />
                {showError}
              </Layout.Section>

              <Layout.Section>
                <Stack distribution={"center"}>
                  <Button
                    primary
                    textAlign={"center"}
                    onClick={() => {
                      let promise = new Promise((resolve) => resolve());
                      for (const variantId in this.props.selectedItems) {
                        const price = textFieldValue;
                        const productVariableInput = {
                          id: this.props.selectedItems[variantId].variants.edges[0].node.id,
                          price: price,
                        };

                        promise = promise.then(() => handleSubmit({ variables: { input: productVariableInput }}));
                      }

                      if (promise) {
                        promise.then(() => this.props.onUpdate().then(() => setHasResults(true)));
                    }}
                  }
                  >
                    Change prices
                  </Button>
                </Stack>
              </Layout.Section>
            </Frame>
          );
        }}
      </Mutation>
    );
  }
}

export default ChangePrices;
