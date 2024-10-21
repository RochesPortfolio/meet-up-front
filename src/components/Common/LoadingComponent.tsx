import React, { CSSProperties } from 'react'
import store from '../../store';
import { HashLoader } from 'react-spinners';
import colors from '../../styles/colors';
import { observer } from 'mobx-react';
interface LoadingComponentProps {
    children: React.ReactNode;
}
const LoadingComponent = observer(( props : LoadingComponentProps) => {
    const { children } = props;
        return (
            <div style={$loadingViewContainer}>
                {
                store.loading ? <HashLoader color={colors.palette.primaryYellow} /> : <>{children}</>
                }
            </div>
    
        )

})

export default LoadingComponent
const $loadingViewContainer: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '90vh',
    width: '100vw',
    backgroundColor: colors.palette.whiteBackground,
    // boxShadow: "0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)"
}
