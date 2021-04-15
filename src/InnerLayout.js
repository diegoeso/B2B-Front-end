import React from 'react'
import InnerHeader from './InnerHeader'
import Footer from './Footer'
/**
 * Creating custom theme for OSDB project
 */

const InnerLayout = (props) => (
					<div className="innepage-wrapper">
					<InnerHeader history={props.history} match ={props} />
						{props.children}
						<Footer  history={props.history} match ={props} />
					</div>
)

export default InnerLayout