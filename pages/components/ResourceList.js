import { Query } from 'react-apollo';
import store from "store-js";
import React from "react";
import { Card, ResourceList, Stack, TextStyle, Thumbnail } from "@shopify/polaris";

import gql from 'graphql-tag';

const GET_PRODUCTS_BY_ID = gql`
  query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        title
        handle
        descriptionHtml
        id
        images(first: 1) {
          edges {
            node {
              id
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              price
              id
            }
          }
        }
      }
    }
  }
`;

const ResourceListWithProducts = () => {
  return (
    <Query query={GET_PRODUCTS_BY_ID} variables={{ ids: store.get('ids') }}>
      {({ data, loading, error }) => {
        if (loading) return <div>Loading…</div>;
        if (error) return <div>{error.message}</div>;
        
        return (
        <Card>
          <ResourceList // Defines your resource list component
            showHeader
            resourceName={{ singular: 'Product', plural: 'Products' }}
            items={data.nodes}
            renderItem={item => {
              const media = (
                <Thumbnail
                  source={
                    item.images.edges[0]
                      ? item.images.edges[0].node.id
                      : ''
                  }
                  alt={
                    item.images.edges[0]
                      ? item.images.edges[0].node.altText
                      : ''
                  }
                />
              );
              const price = item.variants.edges[0].node.price;
              return (
                <ResourceList.Item
                  id={item.id}
                  media={media}
                  accessibilityLabel={`View details for ${item.title}`}
                  onClick={() => {
                    store.set('item', item);
                  }}
                >
                  <Stack>
                    <Stack.Item fill>
                      <h3>
                        <TextStyle variation="strong">
                          {item.title}
                        </TextStyle>
                      </h3>
                    </Stack.Item>
                    <Stack.Item>
                      <p>${price}</p>
                    </Stack.Item>
                  </Stack>
                </ResourceList.Item>
              );
            }}
          />
        </Card>
        );
      }}
    </Query>
  );
}

export default ResourceListWithProducts;
