import React, { useState } from 'react';
import { Page, Layout, EmptyState } from "@shopify/polaris";

const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

const Index = () => {
  // 後ほど使用する
  const [open, setOpen] = useState(false)

  return (
    <Page>
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
