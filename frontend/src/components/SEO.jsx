import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'Aarovi | Handcrafted Indian Fashion',
  description = 'Discover handcrafted Indian fashion at Aarovi. Shop kurtas, sherwani, lehenga, and custom ethnic wear.',
  keywords = 'Indian fashion, handcrafted kurta, ethnic wear, custom clothing',
  url,
  image
}) => {
  const siteUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={siteUrl} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      <link rel="canonical" href={siteUrl} />
    </Helmet>
  );
};

export default SEO;
