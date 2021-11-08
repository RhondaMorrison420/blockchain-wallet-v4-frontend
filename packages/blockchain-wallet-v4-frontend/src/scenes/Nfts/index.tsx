import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'
import styled from 'styled-components'

import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import NftHeader from './Header'
import Marketplace from './Marketplace'
import YourCollection from './YourCollection'

const DEFAULT_NFTS = [
  {
    display_name: 'Doodles',
    image_url:
      'https://lh3.googleusercontent.com/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ=s120',
    opensea_slug: 'doodles-official'
  }
]

const NftPage = styled.div`
  width: 100%;
`

const Nfts: React.FC<Props> = (props) => {
  const { nftsActions } = props
  const [activeTab, setActiveTab] = useState<'explore' | 'my-collection'>('my-collection')

  useEffect(() => {
    nftsActions.fetchNftAssets()
  }, [])

  return (
    <NftPage>
      <NftHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'my-collection' ? <YourCollection {...props} /> : null}
      {activeTab === 'explore' ? <Marketplace {...props} /> : null}
    </NftPage>
  )
}

const mapStateToProps = (state: RootState) => ({
  assetsR: selectors.components.nfts.getNftAssets(state),
  collections: selectors.core.walletOptions.getNfts(state).getOrElse(DEFAULT_NFTS),
  formValues: selectors.form.getFormValues('nftMarketplace')(state),
  marketplace: selectors.components.nfts.getMarketplace(state),
  orders: selectors.components.nfts.getNftOrders(state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  nftsActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(Nfts)
