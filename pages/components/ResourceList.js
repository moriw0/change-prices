import { Query } from 'react-apollo';
import store from "store-js";
import React, { useState } from "react";
import { Card, ResourceList, Stack, TextStyle, Thumbnail } from "@shopify/polaris";

import gql from 'graphql-tag';
import ApplyRandomPrices from "./ApplyRandomPrices";
import ChangePrices from "./ChangePrices";

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
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState({});
  
  return (
    <Query query={GET_PRODUCTS_BY_ID} variables={{ ids: store.get('ids') }}>
      {({ data, loading, error, refetch }) => {
        if (loading) return <div>Loading…</div>;
        if (error) return <div>{error.message}</div>;
        
        const nodesById = {};
        data.nodes.forEach(node => nodesById[node.id] = node);

        const handleSelectionChange = (selectedItems) => {
          const selectedNodes = {};
          selectedItems.forEach(item => selectedNodes[item] = nodesById[item]);

          setSelectedItems(selectedItems)
          setSelectedNodes(selectedNodes)
        }

        const handleClickItem = (itemId) => {
          let index = selectedItems.indexOf(itemId);
          const node = nodesById[itemId];
          if (index === -1) {
            selectedItems.push(itemId)
            selectedNodes[itemId] = node;
          } else {
            selectedItems.splice(index, 1);
            delete selectedNodes[itemId];
          }

          setSelectedItems(selectedItems)
          setSelectedNodes(selectedNodes)
        }

        return (
          <>
          <Card>
            <ResourceList
              showHeader
              resourceName={{ singular: 'Product', plural: 'Products' }}
              items={data.nodes}
              selectable
              selectedItems={selectedItems}
              onSelectionChange={handleSelectionChange}
              renderItem={(item, index) => {
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
                    key={[index, price]}
                    media={media}
                    accessibilityLabel={`View details for ${item.title}`}
                    verticalAlignment="center"
                    onClick={() => handleClickItem(item.id)}
                  >
                    <Stack alignment="center">
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
          {/* <ApplyRandomPrices selectedItems={selectedNodes} onUpdate={refetch} /> */}
          <ChangePrices selectedItems={selectedNodes} onUpdate={refetch} />
        </>
        );
      }}
    </Query>
  );
}

export default ResourceListWithProducts;
