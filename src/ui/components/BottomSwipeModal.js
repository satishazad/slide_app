/**
 * Created by satishazad on 28/10/21
 * File Name: BottomSwipeModal
 * Product Name: WebStorm
 * Project Name: slide_app
 * Path: src/ui/components
 */

import React, { PureComponent } from "react";
import {
    Animated, BackHandler,
    Dimensions, Easing, Modal, PanResponder, Platform, StyleSheet, TouchableWithoutFeedback, View
} from "react-native";
import PropTypes from 'prop-types';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');



class BottomSwipeModal extends PureComponent {


    /**
     * Define Static propTypes
     * */
    static propTypes = {
        isOpen: PropTypes.bool,
        isDisabled: PropTypes.bool,
        startOpen: PropTypes.bool,
        // backdropPressToClose: PropTypes.bool,
        swipeToClose: PropTypes.bool,
        swipeThreshold: PropTypes.bool,
        swipeArea: PropTypes.number,
        position: PropTypes.string,
        entry: PropTypes.string,
        backdrop: PropTypes.bool,
        backdropOpacity: PropTypes.number,
        backdropColor: PropTypes.string,
        backdropContent: PropTypes.element,
        animationDuration: PropTypes.number,
        backButtonClose: PropTypes.number,
        easing: PropTypes.func,
        coverScreen: PropTypes.bool,
        //keyboardTopOffset: PropTypes.number,
        onClosed: PropTypes.func,
        onOpened: PropTypes.func,
        onClosingState: PropTypes.func
    };


    /**
     * Define defaultProps
     * */
    static defaultProps = {
        startOpen: false,
        //backdropPressToClose: true,
        swipeToClose: true,
        swipeThreshold: 50,
        position: 'center',
        backdrop: true,
        backdropOpacity: 0.5,
        backdropColor: '#000000',
        backdropContent: null,
        animationDuration: 500,
        backButtonClose: false,
        easing: Easing.elastic(0.8),
        coverScreen: false,
        keyboardTopOffset: (Platform.OS === 'ios') ? 22 : 0,
        useNativeDriver: true
    };



    /**
     * Constructor for the class
     * */
    constructor(props) {
        super(props);

        this.onBackPress = this.onBackPress.bind(this);
        this.handleOpening = this.handleOpening.bind(this);
        this.animateBackdropOpen = this.animateBackdropOpen.bind(this);
        this.animateBackdropClose = this.animateBackdropClose.bind(this);
        this.stopAnimateOpen = this.stopAnimateOpen.bind(this);
        this.animateOpen = this.animateOpen.bind(this);
        this.stopAnimateClose = this.stopAnimateClose.bind(this);
        this.animateClose = this.animateClose.bind(this);
        this.calculateModalPosition = this.calculateModalPosition.bind(this);
        this.createPanGestureResponder = this.createPanGestureResponder.bind(this);
        this.onViewLayout = this.onViewLayout.bind(this);
        this.onContainerLayout = this.onContainerLayout.bind(this);
        this.renderBackdrop = this.renderBackdrop.bind(this);
        this.renderContent = this.renderContent.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);

        let value = props.entry === 'top' ? -1 * SCREEN_HEIGHT : SCREEN_HEIGHT;
        let position = props.startOpen
                            ? new Animated.Value(0)
                            : new Animated.Value(value);

        this.state = {
            position: position,
            backdropOpacity: new Animated.Value(0),
            isOpen: props.startOpen,
            isAnimateClose: false,
            isAnimateOpen: false,
            swipeToClose: false,
            height: SCREEN_HEIGHT - 200,
            width: SCREEN_WIDTH,
            containerHeight: SCREEN_HEIGHT - 200,
            containerWidth: SCREEN_WIDTH,
            isInitialized: false,
            //keyboardOffset: 0,
            pan: this.createPanGestureResponder(position),
            //positionDest: 0,
            isAnimateBackdrop: false,
        };

    }


    /**
     * Component Life Cycle Methods
     * */
    componentDidMount() {
        this.handleOpening();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isOpen !== prevProps.isOpen) {
            this.handleOpening();
        }
    }

    componentWillUnmount() {
        if (this.props.backButtonClose && Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
        }

    }

    /**
     * Handlers
     * */
    onBackPress() {
        this.close();
        return true;
    }

    handleOpening() {
        if (typeof  this.props.isOpen == 'undefined') return;

        if (this.props.isOpen)
            this.open();
        else
            this.close();
    }


    /**
     * Pan Gesture.
     * Create the pan responder to detect gesture.
     * Only used if swipeToClose is enabled
     * */
    createPanGestureResponder(position) {
        let closingState = false;
        let inSwipeArea = false;

        // let {
        //     positionDest
        // } = this.state;

        let onPanStart = (evt, state) => {
            if (!this.props.swipeToClose ||
                this.props.isDisabled ||
                (this.props.swipeArea && (evt.nativeEvent.pageY - this.state.positionDest) > this.props.swipeArea)) {

                inSwipeArea =  false;
                return false;
            }

            inSwipeArea = true;
            return true;
        };

        let animationEvent = Animated.event([null, {customY: position}], {useNativeDriver: false});

        let onPanMove = (evt, state) => {
            let newClosingState = (this.props.entry === 'top')
                ? -state.dy > this.props.swipeThreshold
                : -state.dy > this.props.swipeThreshold;

            if (this.props.entry === 'top' ? state.dy > 0 : state.dy < 0) return;

            if (newClosingState !== closingState && this.props.onClosingState) {
                this.props.onClosingState(newClosingState);
            }
            closingState = newClosingState;
            state.customY = state.dy + this.state.positionDest;

            animationEvent(evt, state);
        };

        let onPanRelease = (evt, state) => {
            if (!inSwipeArea) return;
            inSwipeArea = false;

            if (this.props.entry === 'top'
                ? -state.dy > this.props.swipeThreshold
                : state.dy > this.props.swipeThreshold)  {

                this.close();
            } else if (!this.state.isOpen) {
                this.animateOpen();
            }
        };

        return PanResponder.create({
            onStartShouldSetPanResponder: onPanStart,
            onPanResponderMove: onPanMove,
            onPanResponderRelease: onPanRelease,
            onPanResponderTerminate: onPanRelease
        });
    }

    /**
     * Modal View layout
     * */
    onViewLayout(evt) {
        let height = evt.nativeEvent.layout.height;
        let width = evt.nativeEvent.layout.width;

        let newState = {};

        if (height !== this.state.height) {
            newState.height = height;
        }

        if (width !== this.state.width) {
            newState.width = width;
        }

        this.setState(newState);

        if (this.onViewLayoutCalculated) {
            this.onViewLayoutCalculated();
        }

    }

    /*
   * Event called when the container view layout is calculated
   */
    onContainerLayout(evt) {
        const height = evt.nativeEvent.layout.height;
        const width = evt.nativeEvent.layout.width;

        // If the container size is still the same we're done
        if (
            height === this.state.containerHeight &&
            width === this.state.containerWidth
        ) {
            this.setState({isInitialized: true});
            return;
        }

        if (this.state.isOpen || this.state.isAnimateOpen) {
            this.animateOpen();
        }

        if (this.props.onLayout) this.props.onLayout(evt);
        this.setState({
            isInitialized: true,
            containerHeight: height,
            containerWidth: width
        });
    }

    renderBackdrop() {
        let backdrop = null;

        if (this.props.backdrop) {
            backdrop = (
                <TouchableWithoutFeedback
                    onPress={this.props.backdropPressToClose ? this.close : null}>
                    <Animated.View
                        importantForAccessibility="no"
                        style={[styles.absolute, {opacity: this.state.backdropOpacity}]}>
                        <View
                            style={[
                                styles.absolute,
                                {
                                    backgroundColor: this.props.backdropColor,
                                    opacity: this.props.backdropOpacity
                                }
                            ]}
                        />
                        {this.props.backdropContent || []}
                    </Animated.View>
                </TouchableWithoutFeedback>
            );
        }
    }

    renderContent() {
        const size = {
            height: this.state.containerHeight,
            width: this.state.containerWidth
        };
        const offsetX = (this.state.containerWidth - this.state.width) / 2;

        return (
            <Animated.View
                onLayout={this.onViewLayout}
                style={[
                    styles.content,
                    size,
                    this.props.style,
                    {
                        transform: [
                            {translateY: this.state.position},
                            {translateX: offsetX}
                        ]
                    }
                ]}
                {...this.state.pan.panHandlers}>
                {this.props.children}
            </Animated.View>
        );
    }


    /**
     * Animation handlers
     * Open animation for the backdrop, will fade in
     * */
    animateBackdropOpen() {
        if (this.state.isAnimateBackdrop && this.state.animBackdrop) {
            this.state.animBackdrop.stop();
        }

        this.setState({ isAnimateBackdrop: true });

        let animBackdrop = Animated.timing(this.state.backdropOpacity, {
            toValue: 1,
            duration: this.props.animationDuration,
            easing: this.props.easing,
            useNativeDriver: this.props.useNativeDriver
        });

        animBackdrop.start(() => {
            this.setState({
                isAnimateBackdrop: false,
                animBackdrop
            });
        });
    }

    /**
     * Close Animation for the backdrop
     * */
    animateBackdropClose() {
        if (this.state.isAnimateBackdrop && this.state.animBackdrop) {
            this.state.animBackdrop.stop();
        }

        this.setState({ isAnimateBackdrop: true });

        let animBackdrop = Animated.timing(this.state.backdropOpacity, {
            toValue: 0,
            duration: this.props.animationDuration,
            easing: this.props.easing,
            useNativeDriver: this.props.useNativeDriver
        });

        animBackdrop.start(() => {
            this.setState({
                isAnimatedBackdrop: false,
                animBackdrop
            });
        });
    }

    /**
     * Stop opening animation
     * */
    stopAnimateOpen() {
        if (this.state.isAnimateOpen) {
            if (this.state.animOpen)
                this.state.animOpen.stop();

            this.setState({ isAnimateOpen: false });
        }
    }

    /**
     * Stop closing animation
     */
    stopAnimateClose() {
        if (this.state.isAnimateClose) {
            if (this.state.animClose)
                this.state.animClose.stop();

            this.setState({isAnimateClose: false});
        }
    }

    /**
     * Open animation for the modal, will move up
     * */
    animateOpen() {
        this.stopAnimateClose();

        if (this.props.backdrop) {
            this.animateBackdropOpen();
        }

        this.setState({
            isAnimateOpen: true,
            isOpen: true
        }, () => {
           requestAnimationFrame(() => {
               let positionDest = this.calculateModalPosition(this.state.containerHeight, this.state.containerWidth);

               let animOpen = Animated.timing(this.state.position, {
                   toValue: positionDest,
                   duration: this.props.animationDuration,
                   easing: this.props.easing,
                   useNativeDriver: this.props.useNativeDriver
               });

               animOpen.start(() => {
                   this.setState({
                       isAnimateOpen: false,
                       animOpen,
                       positionDest
                   });

                   if (this.props.onOpened) {
                       this.props.onOpened();
                   }
               });
           });
        });
    }

    /**
     * Close animation for the modal, will move down
     * */
    animateClose() {
        this.stopAnimateOpen();

        if (this.props.backdrop) {
            this.animateBackdropClose();
        }

        this.setState({
            isAnimateClose: true,
            isOpen: false
        }, () => {
            let animClose = Animated.timing(this.state.position, {
                toValue: this.props.entry === 'top' ? -this.state.containerHeight : this.state.containerHeight,
                duration: this.props.animationDuration,
                easing: this.props.easing,
                useNativeDriver: this.props.useNativeDriver
            });

            animClose.start(() => {
                this.setState({
                    isAnimateClose: false,
                    animClose
                }, () => {
                    this.state.position.setValue(this.props.entry === 'top' ? -this.state.containerHeight : this.state.containerHeight);
                });

                if (this.props.onClosed) {
                    this.props.onClosed();
                }
            });
        });
    }

    /**
     * Calculate when should be placed the modal
     */
    calculateModalPosition(containerHeight, containerWidth) {
        let position = 0;

        if (this.props.position === 'bottom') {
            position = containerHeight - this.state.height;
        } else if (this.props.position === 'center') {
            position = containerHeight / 2 - this.state.height / 2;
        }
        // Checking if the position >= 0
        if (position < 0) position = 0;
        return position;
    }


    /**
     * Render
     * */
    render() {

        let visible = this.state.isOpen ||
                    this.state.isAnimateOpen ||
                    this.state.isAnimateClose;

        if (!visible) {
            return <View />
        }

        let content = (
            <View
                importantForAccessibility={'yes'}
                accessibilityViewIsModal={true}
                style={[styles.transparent, styles.absolute]}
                pointerEvents={'box-none'}>

                <View
                    style={{ flex: 1}}
                    pointerEvents={'box-none'}
                    onLayout={this.onContainerLayout}>
                    {visible && this.renderBackdrop()}
                    {visible && this.renderContent()}
                </View>
            </View>
        );

        if (!this.props.coverScreen) {
            return content;
        }

        return (
            <Modal
                onRequestClose={() => {
                    if (this.props.backButtonClose) {
                        this.close();
                    }
                }}
                supportedOrientations={[
                    'landscape', 'portrait', 'portrait-upside-down'
                ]}
                transparent={false}
                visible={visible}
                hardwareAccelerated={true}>

                {content}
            </Modal>
        );
    }


    /**
     * Public Methods
     */
    open() {
        if (this.props.isDisabled) return;
        if (
            !this.state.isAnimateOpen &&
            (!this.state.isOpen || this.state.isAnimateClose)
        ) {
            this.onViewLayoutCalculated = () => {
                this.animateOpen();
                if (this.props.backButtonClose && Platform.OS === 'android')
                    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
                this.onViewLayoutCalculated = null;
            };
            this.setState({isAnimateOpen: true});
        }
    }

    close() {
        if (this.props.isDisabled) return;
        if (
            !this.state.isAnimateClose &&
            (this.state.isOpen || this.state.isAnimateOpen)
        ) {
            this.animateClose();
            if (this.props.backButtonClose && Platform.OS === 'android')
                BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
        }
    }

}


const styles = StyleSheet.create({
    content: {
        backgroundColor: 'transparent',

    },
    absolute: {
        position: 'absolute',
        top: 140,
        bottom: -70,
        left: 0,
        right: 0
    },
    transparent: {
        zIndex: 2,
        backgroundColor: 'rgba(0,0,0,0)'
    },
});


export default BottomSwipeModal;
