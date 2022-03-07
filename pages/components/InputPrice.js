import React, { useState, useCallback } from "react";
import gql from "graphql-tag";
import { Mutation } from 'react-apollo';
import { TextField, Layout, Button, Banner, Toast, Stack, Frame } from "@shopify/polaris";

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

function InputPrice(props) {
  const updatePrice = useMutation(UPDATE_PRICE);

  const [hasResults, setHasResults] = useState(false);
  const [error, setError] = useState();

  const showError = error && (
    <Banner status="critical">{error.message}</Banner>
  );

  const showToast = hasResults && (
    <Toast
      content="Successfully updated"
      onDismiss={() => setHasResults(false)}
    />
  );

  const handleClick = async () => {
    for (const variantId in props.selectedItems) {
      const price = textFieldValue;
      const productVariableInput = {
        id: props.selectedItems[variantId].variants.edges[0].node.id,
        price: price
      };

      try {
        await updatePrice({
          variables: {
            input: productVariableInput
          }
        });
      } catch (e) {
        setError(e)
      }

      try {
        props.onUpdate()
        setHasResults(true)
      } catch (e) {
        setError(e)
      }
    }
  };
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
            onClick={() => handleClick()} >
            Change prices
          </Button>
        </Stack>
      </Layout.Section>
    </Frame>
  );
}

export default InputPrice;
