import { Helmet } from 'react-helmet-async';

/**
 * SEO
 * ────
 * Renders <head> meta tags + optional JSON-LD structured data.
 *
 * Usage:
 *   <SEO title="Product Name | Aarovi" description="..." image={product.images[0]} type="product" product={product} />
 */
const SEO = ({
  title       = 'Aarovi | Handcrafted Indian Fashion',
  description = 'Discover handcrafted Indian fashion at Aarovi. Shop kurtas, sherwani, lehenga, and custom ethnic wear.',
  keywords    = 'Indian fashion, handcrafted kurta, ethnic wear, custom clothing, lehenga, sherwani India',
  url,
  image,
  type        = 'website',  // 'website' | 'product'
  product,                  // pass full product object for Product schema
  noindex     = false,
}) => {
  const siteUrl   = url || (typeof window !== 'undefined' ? window.location.href : '');
  const canonical = siteUrl.split('?')[0]; // strip query string from canonical

  const productSchema = type === 'product' && product ? JSON.stringify({
    '@context': 'https://schema.org',
    '@type':    'Product',
    name:        product.name,
    image:       product.images || [],
    description: product.description,
    sku:         product._id,
    brand: { '@type': 'Brand', name: 'Aarovi' },
    offers: {
      '@type':        'Offer',
      priceCurrency:  'INR',
      price:           product.price,
      availability:   'https://schema.org/InStock',
      url:             canonical,
    },
  }) : null;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords"    content={keywords} />
      {noindex
        ? <meta name="robots" content="noindex, nofollow" />
        : <meta name="robots" content="index, follow" />
      }
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title"       content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url"         content={siteUrl} />
      <meta property="og:type"        content={type === 'product' ? 'product' : 'website'} />
      <meta property="og:site_name"   content="Aarovi" />
      <meta property="og:locale"      content="en_IN" />
      {image && <meta property="og:image"       content={image} />}
      {image && <meta property="og:image:width"  content="800" />}
      {image && <meta property="og:image:height" content="1067" />}

      {/* Twitter */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Product structured data */}
      {productSchema && (
        <script type="application/ld+json">{productSchema}</script>
      )}
    </Helmet>
  );
};

export default SEO;
