import React from 'react';
import style from "../../styles/BlockingOverlay.module.css"

import {SyncLoader} from 'react-spinners';
import { css } from '@emotion/react';

const loaderCSS = css`
	z-index:2147483647;`

function BlockingOverlay(props) {

    let zIndex = 2147483645;
    let showLoader = false;
    if(props){
        if(props.zIndex)
            zIndex = props.zIndex;
        if(props.showLoader)
        showLoader = props.showLoader;
    }
    
    return (
        <div style={{zIndex: zIndex}} className={style.overlay}>
            {
                showLoader && (
                    // <p className={style.loader}>loading</p>
                    <SyncLoader css={loaderCSS} size={15} color="#326b84" loading></SyncLoader>
                )
            }
        </div>
    )
}

export default BlockingOverlay;
