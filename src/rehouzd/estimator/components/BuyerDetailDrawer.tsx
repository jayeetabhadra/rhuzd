import React, { useMemo } from 'react';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerFooter,
  Flex,
  Heading,
  Text,
  Badge,
  Divider,
  Progress,
  VStack,
  Link,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Icon,
  Button,
  useTheme,
  Spacer,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FaPhone,
  FaMapMarkerAlt,
  FaHistory,
  FaFileContract,
  FaDownload,
  FaEnvelope
} from 'react-icons/fa';
import { Buyer } from '../store/buyerSlice';

const MotionBox = motion(Box);

interface BuyerDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  buyer: Buyer | null;
}

interface PurchaseHistoryEntry {
  address?: string;
  date?: string;
  price?: string | number;
}

const BuyerDetailDrawer: React.FC<BuyerDetailDrawerProps> = ({ isOpen, onClose, buyer }) => {
  // Return early pattern after hooks
  // Define a safe empty placeholder if buyer is null
  const emptyBuyer = {
    id: '',
    name: '',
    address: '',
    type: [],
    priceRange: '',
    likelihood: 'Possible',
    recentPurchases: 0,
    score: 0,
    matchDetails: {
      geographicScore: 0,
      recencyScore: 0,
      priceScore: 0,
      characteristicsScore: 0,
      activityScore: 0
    }
  } as Buyer;
  
  // Always use the buyer data or fallback to empty buyer
  const safeBuyer = buyer || emptyBuyer;

  
  // Theme colors
  const bgColor = 'background.primary';
  const borderColor = 'border.primary';
  const textSecondaryColor = 'text.secondary';
  const brandColor = 'brand.500';

  // Calculate progress percentage based on buyer's match score
  // Maximum score is approximately 50 (15 geographic + 10 recency + 10 price + 8 characteristics + 15 activity)
  const getScorePercentage = useMemo(() => {
    // Get actual score or default to 0
    const score = safeBuyer.score || 0;
    
    // Cap the maximum score at 50 for a 100% fill
    const maxPossibleScore = 50;
    // Convert score to percentage (capped at 100%)
    return Math.min(Math.round((score / maxPossibleScore) * 100), 100);
  }, [safeBuyer.score]);
  
  // Determine likelihood based on score thresholds
  const getLikelihoodInfo = useMemo(() => {
    const score = safeBuyer.score || 0;
    
    if (score > 40) {
      return { text: 'Likely', colorScheme: 'green', gradient: 'styles.green-gradient' };
    } else if (score > 30) {
      return { text: 'Most likely', colorScheme: 'green', gradient: 'styles.green-gradient' };
    } else {
      return { text: 'Less likely', colorScheme: 'yellow', gradient: 'styles.yellow-gradient' };
    }
  }, [safeBuyer.score]);

  // Extract purchase history from buyer profile if available, or use mock data
  const purchaseHistory = useMemo(() => {
    // Check if buyer has purchase_history in their profile
    if (safeBuyer.purchase_history && Array.isArray(safeBuyer.purchase_history) && safeBuyer.purchase_history.length > 0) {
      return safeBuyer.purchase_history.slice(0, 3).map((purchase: PurchaseHistoryEntry) => ({
        address: purchase.address || "Address not available",
        date: purchase.date || new Date().toLocaleDateString(),
        price: typeof purchase.price === 'number' ? `$${purchase.price.toLocaleString()}` : purchase.price || "Price not available"
      }));
    }
    
    // Use random but plausible mock data based on buyer's preferences
    return [
      { address: `123 Main St, ${safeBuyer.address.split(',')[0] || 'Atlanta, GA'}`, date: "Mar 15, 2023", price: "$145,000" },
      { address: `456 Oak Ave, ${safeBuyer.address.split(',')[0] || 'Atlanta, GA'}`, date: "Jan 22, 2023", price: "$112,500" },
      { address: `789 Pine Ln, ${safeBuyer.address.split(',')[0] || 'Atlanta, GA'}`, date: "Nov 10, 2022", price: "$127,000" },
    ];
  }, [safeBuyer]);

  // Return early if no buyer and dialog not open
  if (!buyer && !isOpen) {
    return null;
  }

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size="md"
      autoFocus={false}
    >
      <DrawerOverlay
        backdropFilter="blur(4px)"
        bg="blackAlpha.300"
      />
      <DrawerContent
        bg={bgColor}
        boxShadow="dark-lg"
        maxH="100vh"
        onWheel={(e) => e.stopPropagation()} // Consider keeping if needed for event isolation
      >
        <DrawerCloseButton
          size="lg"
          color="brand.500"
          bg="white"
          borderRadius="full"
          zIndex={10}
          top={4}
          right={4}
          _hover={{ bg: "gray.100" }}
        />
        <DrawerHeader
          borderBottomWidth="1px"
          py={6}
          bg={bgColor}
        >
          <Flex alignItems="center">
            <Heading size="lg">{safeBuyer.name}</Heading>
            <Spacer />
            <Badge 
              colorScheme="red" 
              fontSize="sm"
              borderRadius="full"
              px={2}
              py={1}
              ml={2}
            >
              {safeBuyer.recentPurchases} Recent Purchases
            </Badge>
          </Flex>
        </DrawerHeader>

        <DrawerBody
          py={6}
          overflowY="auto"
          sx={{ // Removed custom scrollbar styles
            scrollBehavior: 'smooth',
            msOverflowStyle: 'auto',
            touchAction: 'pan-y',
          }}
          onWheel={(e) => e.stopPropagation()} // Consider keeping if needed for event isolation
        >
          <VStack spacing={8} align="stretch" w="100%">
            {/* Contact Information */}
            <Box w="100%">
              <Heading size="md" mb={4}>Contact Information</Heading>
              <VStack spacing={3} align="stretch">
                <Flex align="center">
                  <Icon as={FaMapMarkerAlt as React.ElementType} mr={3} color={brandColor} />
                  <Text fontWeight="medium">{safeBuyer.address}</Text>
                </Flex>
                {safeBuyer.phone && (
                  <Flex align="center">
                    <Icon as={FaPhone as React.ElementType} mr={3} color={brandColor} />
                    <Link href={`tel:${safeBuyer.phone}`}>{safeBuyer.phone}</Link>
                  </Flex>
                )}
                <Flex align="center">
                  <Icon as={FaEnvelope as React.ElementType} mr={3} color={brandColor} />
                  <Link href={`mailto:info@${safeBuyer.name.toLowerCase().replace(/\s+/g, '')}.com`}>
                    info@{safeBuyer.name.toLowerCase().replace(/\s+/g, '')}.com
                  </Link>
                </Flex>
              </VStack>
            </Box>

            <Divider />

            {/* Buyer Details */}
            <Box w="100%">
              <Heading size="md" mb={4}>Buyer Details</Heading>
              <SimpleGrid columns={2} spacing={4}>
                <Stat>
                  <StatLabel color={textSecondaryColor}>Price Range</StatLabel>
                  <StatNumber fontSize="lg">{safeBuyer.priceRange}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel color={textSecondaryColor}>Score</StatLabel>
                  <StatNumber fontSize="lg">{safeBuyer.score || 0}</StatNumber>
                </Stat>
              </SimpleGrid>

              <Box mt={6}>
                <Text fontWeight="medium" mb={2}>Purchase Likelihood</Text>
                <Flex align="center">
                  <Box flex="1" mr={4}>
                    <Progress
                      value={getScorePercentage}
                      colorScheme={getLikelihoodInfo.colorScheme}
                      bgGradient={getLikelihoodInfo.gradient}
                      size="sm"
                      borderRadius="full"
                    />
                  </Box>
                  <Text fontWeight="bold">{getLikelihoodInfo.text}</Text>
                </Flex>
              </Box>
            </Box>

            <Divider />

            {/* Recent Activity */}
            <Box w="100%">
              <Heading size="md" mb={4}>Recent Purchases</Heading>
              <VStack spacing={4} align="stretch">
                {purchaseHistory.map((purchase: { address: string; date: string; price: string }, idx: number) => (
                  <MotionBox
                    key={idx}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor={borderColor}
                    whileHover={{ y: -2, boxShadow: 'md' }}
                    transition={{ duration: 0.2 }}
                  >
                    <Flex justify="space-between" mb={2}>
                      <Text fontWeight="bold">{purchase.address}</Text>
                      <Badge colorScheme="green">{purchase.price}</Badge>
                    </Flex>
                    <Flex align="center">
                      <Icon as={FaHistory as React.ElementType} color={textSecondaryColor} mr={2} />
                      <Text fontSize="sm" color={textSecondaryColor}>{purchase.date}</Text>
                    </Flex>
                  </MotionBox>
                ))}
              </VStack>
            </Box>

            <Divider />

            {/* Actions */}
            <Flex justify="flex-end" mb={4}>
              <Button leftIcon={<Icon as={FaDownload as React.ElementType} />} colorScheme="brand">
                Download Profile
              </Button>
            </Flex>
          </VStack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button onClick={onClose} variant="outline" width="100%">
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default BuyerDetailDrawer;