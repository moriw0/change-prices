import React, { useState } from 'react';
import { Page, Layout, EmptyState } from "@shopify/polaris";
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';

const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

const Index = () => {
  const [open, setOpen] = useState(false)

  const handleSelection = (resources) => {
    setOpen(false)
    console.log(resources);
  }

  return (
    <Page>
      <TitleBar
        primaryAction={{
          content: 'Select products',
          onAction: () => setOpen(true),
        }}
      />

      <ResourcePicker // Resource picker component
        resourceType="Product"
        showVariants={false}
        open={open}
        onSelection={(resources) => handleSelection(resources)}
        onCancel={() => setOpen(false)}
      />

      <Layout>
        <EmptyState // Empty state component
          heading="Discount your products temporarily"
          action={{
            content: "Select products",
            onAction: () => setOpen(true)
          }}
          image={img}
        >
          <p>Select products to change their price temporarily.</p>
        </EmptyState>
      </Layout>
    </Page>
  )
}

export default Index;
