import React from 'react';
import {
    VStack,
    HStack,
    Button,
    Flex,
    Icon,
    Text,
    Box,
    Badge
} from '@chakra-ui/react';
import { FaGoogle } from 'react-icons/fa';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import CommonModal from '../components/CommonModal';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (email: string, password: string, rememberMe: boolean) => Promise<void>;
    onSignUp: (firstName: string, lastName: string, email: string, password: string, confirm: string) => Promise<void>;
    onGoogleLogin: () => void;
    showForgotPassword: boolean;
    setShowForgotPassword: (show: boolean) => void;
    onForgotPasswordSubmit: () => void;
    showSignUp: boolean;
    setShowSignUp: (isSignUp: boolean) => void;
    planInfo?: string; // Optional plan information to display
}

const AuthModal: React.FC<AuthModalProps> = ({ 
    isOpen, 
    onClose, 
    onLogin, 
    onSignUp, 
    onGoogleLogin, 
    showForgotPassword, 
    setShowForgotPassword, 
    onForgotPasswordSubmit, 
    showSignUp, 
    setShowSignUp,
    planInfo
}) => {
    const handleClose = () => {
        onClose();
        setShowForgotPassword(false);
        setShowSignUp(false);
    };
    
    const footer = (
        <VStack spacing={4} width="100%">
            <HStack spacing={4} mb={4} w="100%" justifyContent="center">
                {!showForgotPassword && !showSignUp && (
                    <>
                        <Button colorScheme="brand" type="submit" w="100%" onClick={() => {
                            const form = document.querySelector('#login-form') as HTMLFormElement;
                            form?.requestSubmit();
                        }}>
                            Login
                        </Button>
                        <Button colorScheme="background.secondary" variant="ghost" onClick={() => setShowSignUp(true)} w="100%">
                            Sign up
                        </Button>
                    </>
                )}
                {!showForgotPassword && showSignUp && (
                    <>
                        <Button colorScheme="brand" type="submit" w="100%" onClick={() => {
                            const form = document.querySelector('#signup-form') as HTMLFormElement;
                            form?.requestSubmit();
                        }}>
                            Sign up
                        </Button>
                        <Button colorScheme="background.secondary" variant="ghost" onClick={() => setShowSignUp(false)} w="100%">
                            Back to Login
                        </Button>
                    </>
                )}
            </HStack>
            {/* Google Login Button */}
            {!showForgotPassword && !showSignUp && (
                <Button
                    leftIcon={<Icon as={FaGoogle as React.ElementType} />}
                    colorScheme="blue"
                    variant="outline"
                    w="100%"
                    onClick={onGoogleLogin}
                    mt={2}
                >
                    Sign in with Google
                </Button>
            )}
            {!showForgotPassword && showSignUp && (
                <Button
                    leftIcon={<Icon as={FaGoogle as React.ElementType} />}
                    colorScheme="blue"
                    variant="outline"
                    w="100%"
                    onClick={onGoogleLogin}
                    mt={2}
                >
                    Sign up with Google
                </Button>
            )}
        </VStack>
    );
    
    const getTitle = () => {
        if (showForgotPassword) return 'Reset Your Password';
        if (showSignUp) {
            return `Create your account`;
        }
        return `Sign in to your account`;
    };
    
    return (
        <CommonModal 
            isOpen={isOpen} 
            onClose={handleClose}
            title={getTitle()}
            footer={footer}
        >
            {planInfo && (
                <Box mb={4} p={1} bg="green.50" borderRadius="md" borderWidth="1px" borderColor="green.200" width="fit-content" mx="auto">
                    <Text color="green.800" fontWeight="bold" fontSize="sm" fontFamily="body" align="center">
                        {planInfo}
                    </Text>
                </Box>
            )}
            
            {showForgotPassword ? (
                <ForgotPasswordForm onClose={onClose} onBackToLogin={() => setShowForgotPassword(false)} onSubmit={onForgotPasswordSubmit} />
            ) : showSignUp ? (
                <SignUpForm onSignUp={onSignUp} onError={(message) => console.error(message)} onBackToLogin={() => setShowSignUp(false)} />
            ) : (
                <LoginForm onLogin={onLogin} onError={(message) => console.error(message)} onSignUp={() => setShowSignUp(true)} onForgotPassword={() => { setShowForgotPassword(true); }} />
            )}
        </CommonModal>
    );
};

export default AuthModal;