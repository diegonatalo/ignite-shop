import useEmblaCarousel from 'embla-carousel-react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { MouseEvent, useEffect, useState } from 'react'
import Stripe from 'stripe'
import { CartButton } from '../components/CartButton'
import { ProductSkeleton } from '../components/ProductSkeleton'
import { Product as ProductType } from '../contexts/CartContext'
import { useCart } from '../hooks/useCart'
import { stripe } from '../lib/stripe'
import { HomeContainer, Product, SliderContainer } from '../styles/pages/home'

interface HomeProps {
  products: ProductType[]
}

export default function Home({ products }: HomeProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    skipSnaps: false,
    dragFree: true
  })

  useEffect(() => {
    const timeOut = setTimeout(() => setIsLoading(false), 2000)

    return () => clearTimeout(timeOut)
  }, [])

  const { addToCart, checkIfItemAlreadyExists } = useCart()

  function handleAddToCart(
    e: MouseEvent<HTMLButtonElement>,
    product: ProductType
  ) {
    e.preventDefault()
    addToCart(product)
  }

  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>

      <div style={{ overflow: 'hidden', width: '100%' }}>
        <HomeContainer className="keen-slider">
          <div className="embla" ref={emblaRef}>
            <SliderContainer className="embla__container container">
              {isLoading ? (
                <>
                  <ProductSkeleton />
                  <ProductSkeleton />
                  <ProductSkeleton />
                </>
              ) : (
                <>
                  {products.map((product) => {
                    return (
                      <Product
                        href={`/product/${product.id}`}
                        className="embla__slide"
                        key={product.id}
                        prefetch={false}
                      >
                        <Image
                          src={product.imageUrl}
                          width={520}
                          height={480}
                          alt=""
                        />

                        <footer>
                          <div>
                            <strong>{product.name}</strong>
                            <span>{product.price}</span>
                          </div>
                          <CartButton
                            color={'green'}
                            size={'large'}
                            disabled={checkIfItemAlreadyExists(product.id)}
                            onClick={(e) => handleAddToCart(e, product)}
                          />
                        </footer>
                      </Product>
                    )
                  })}
                </>
              )}
            </SliderContainer>
          </div>
        </HomeContainer>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })

  const products = response.data.map((product) => {
    const price = product.default_price as Stripe.Price

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(price.unit_amount! / 100),
      numberPrice: price.unit_amount! / 100,
      defaultPriceId: price.id
    }
  })

  return {
    props: {
      products
    },
    revalidate: 2 * 60 * 60 // 2 horas
  }
}
