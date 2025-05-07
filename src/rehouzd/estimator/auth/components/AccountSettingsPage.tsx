import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Button,
    useToast,
    HStack,
    Text,
    IconButton,
    Flex,
    Tooltip,
} from '@chakra-ui/react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setUserData } from '../../store/userSlice';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

const AccountSettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const dispatch = useAppDispatch();

    // Retrieve user data from Redux (which is set by your login handler)
    const { user_id, fname, lname, email, mobile } = useAppSelector((state) => state.user);

    // Local state for editable form fields
    const [firstName, setFirstName] = useState(fname);
    const [lastName, setLastName] = useState(lname);
    const [mobileNumber, setMobileNumber] = useState(mobile);

    // Define theme colors
    const bgColor = 'background.primary';
    const borderColor = 'border.primary';
    const textColor = 'text.primary';
    const textSecondaryColor = 'text.secondary';
    const inputDisabledBg = 'background.secondary';
    const borderFocusColor = 'brand.500';

    // When Redux user data changes, update the local state
    useEffect(() => {
        setFirstName(fname);
        setLastName(lname);
        setMobileNumber(mobile);
    }, [fname, lname, mobile]);

    // Check if any changes have been made compared to the original values from Redux
    const hasChanges =
        firstName !== fname || lastName !== lname || mobileNumber !== mobile;
    
    // Check if all editable fields are empty (using fallback empty strings to avoid errors)
    const isEmpty =
        !((firstName || '').trim() || (lastName || '').trim() || (mobileNumber || '').trim());

    // Handler to update the profile on the backend
    const handleUpdateProfile = async () => {
        if (!user_id) {
            toast({
                title: 'User id is missing',
                description: 'User id is required to update profile.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        // Construct payload matching what the backend expects
        const payload = {
            user_id, // the user id from the Redux store
            email, // email remains the same
            first_name: firstName,
            last_name: lastName,
            mobile_number: mobileNumber,
        };

        try {
            const response = await fetch('/api/auth/profile-update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (!response.ok) {
                toast({
                    title: 'Error updating profile',
                    description: data.message || 'An error occurred',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                const updatedUser = {
                    user_id: data.user.user_id,
                    fname: data.user.first_name, // mapping backend key to Redux key
                    lname: data.user.last_name,
                    email: data.user.email,
                    mobile: data.user.mobile_number,
                };
                // Update the Redux store with the new user data returned from the backend
                dispatch(setUserData(updatedUser));
                setFirstName(updatedUser.fname);
                setLastName(updatedUser.lname);
                setMobileNumber(updatedUser.mobile);
                toast({
                    title: 'Profile updated successfully',
                    description: 'Your profile has been updated',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: 'Network error',
                description: 'Unable to update profile',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    // Handle canceling the changes and reverting to original values
    const handleCancel = () => {
        setFirstName(fname);
        setLastName(lname);
        setMobileNumber(mobile);
        toast({
            title: 'Changes discarded',
            status: 'info',
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <Box 
            p={8} 
            maxW="800px" 
            mx="auto" 
            my={8}
            bg={bgColor}
            borderRadius="lg"
            boxShadow="md"
            borderWidth="1px"
            borderColor={borderColor}
        >
            <Heading as="h2" size="lg" mb={6} color={textColor}>
                Account Settings
            </Heading>
            <Text mb={6} fontSize="md" color={textSecondaryColor}>
                Make changes to your profile information below. Your changes will be saved automatically.
            </Text>
            <VStack spacing={6} align="stretch">
                <FormControl id="fname">
                    <FormLabel color={textColor}>First Name</FormLabel>
                    <Input
                        placeholder="Enter your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        borderColor={borderColor}
                        _hover={{ borderColor: borderFocusColor }}
                        _focus={{ borderColor: borderFocusColor, boxShadow: `0 0 0 1px ${borderFocusColor}` }}
                    />
                </FormControl>
                <FormControl id="lname">
                    <FormLabel color={textColor}>Last Name</FormLabel>
                    <Input
                        placeholder="Enter your last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        borderColor={borderColor}
                        _hover={{ borderColor: borderFocusColor }}
                        _focus={{ borderColor: borderFocusColor, boxShadow: `0 0 0 1px ${borderFocusColor}` }}
                    />
                </FormControl>
                <FormControl id="email">
                    <FormLabel color={textColor}>Email</FormLabel>
                    <Input 
                        placeholder="Not available" 
                        value={email || ''} 
                        isReadOnly 
                        bg={inputDisabledBg}
                        borderColor={borderColor}
                    />
                    <Text fontSize="sm" mt={1} color={textSecondaryColor}>
                        Email cannot be changed. Contact support for assistance.
                    </Text>
                </FormControl>
                <FormControl id="mobile">
                    <FormLabel color={textColor}>Mobile Number</FormLabel>
                    <Input
                        placeholder="Enter your mobile number"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        borderColor={borderColor}
                        _hover={{ borderColor: borderFocusColor }}
                        _focus={{ borderColor: borderFocusColor, boxShadow: `0 0 0 1px ${borderFocusColor}` }}
                    />
                </FormControl>

                {/* Footer with action buttons */}
                <Flex justifyContent="space-between" mt={4}>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/')}
                        borderColor={borderColor}
                        _hover={{ borderColor: borderFocusColor }}
                    >
                        Back to Home
                    </Button>

                    {hasChanges && !isEmpty && (
                        <HStack spacing={4}>
                            <Tooltip label="Discard changes">
                                <IconButton
                                    aria-label="Discard changes"
                                    icon={<CloseIcon />}
                                    onClick={handleCancel}
                                    colorScheme="red"
                                    variant="outline"
                                />
                            </Tooltip>
                            <Tooltip label="Save changes">
                                <Button
                                    leftIcon={<CheckIcon />}
                                    colorScheme="brand"
                                    onClick={handleUpdateProfile}
                                >
                                    Update Profile
                                </Button>
                            </Tooltip>
                        </HStack>
                    )}
                </Flex>
            </VStack>
        </Box>
    );
};

export default AccountSettingsPage;
