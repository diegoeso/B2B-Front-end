import React from 'react'
import Header from './Header'
import Footer from './Footer'
/**
 * Creating custom theme for OSDB project
 */

const HomeLayout = (props) => (
					<div>
					<Header history={props.history} match ={props} />
						{props.children}
					<Footer history={props.history} match ={props} />
					</div>
				
)

export default HomeLayout