import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  RefreshControl,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, RELIGION_TYPES } from '../../constants';
import { PlaceOfWorship, LiveEvent, MarketplaceItem } from '../../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState<PlaceOfWorship[]>([]);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [featuredItems, setFeaturedItems] = useState<MarketplaceItem[]>([]);
  const [currentLocation, setCurrentLocation] = useState('New Delhi, India');

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      // TODO: Replace with actual API calls
      setNearbyPlaces(getMockNearbyPlaces());
      setLiveEvents(getMockLiveEvents());
      setFeaturedItems(getMockFeaturedItems());
    } catch (error) {
      console.error('Error loading home data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const getReligionIcon = (type: string) => {
    const religion = RELIGION_TYPES.find(r => r.key === type);
    return religion ? religion.icon : '🏛️';
  };

  const getReligionColor = (type: string) => {
    const religion = RELIGION_TYPES.find(r => r.key === type);
    return religion ? religion.color : COLORS.gray[600];
  };

  const renderQuickAction = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.quickActionCard}
      onPress={item.onPress}
    >
      <LinearGradient
        colors={item.gradient}
        style={styles.quickActionGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Icon name={item.icon} size={24} color={COLORS.white} />
        <Text style={styles.quickActionText}>{item.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderNearbyPlace = ({ item }: { item: PlaceOfWorship }) => (
    <TouchableOpacity
      style={styles.placeCard}
      onPress={() => navigation.navigate('PlaceDetails' as any, { placeId: item.id })}
    >
      <Image
        source={{ uri: item.images[0] || 'https://via.placeholder.com/300x200' }}
        style={styles.placeImage}
      />
      <View style={styles.placeOverlay}>
        <Text style={styles.placeReligionIcon}>{getReligionIcon(item.type)}</Text>
      </View>
      <View style={styles.placeContent}>
        <Text style={styles.placeName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.placeInfo}>
          <Icon name="location-on" size={14} color={COLORS.gray[500]} />
          <Text style={styles.placeAddress} numberOfLines={1}>{item.address}</Text>
        </View>
        <View style={styles.placeStats}>
          <View style={styles.statItem}>
            <Icon name="star" size={14} color={COLORS.warning} />
            <Text style={styles.statText}>{item.rating.toFixed(1)}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="people" size={14} color={COLORS.primary} />
            <Text style={styles.statText}>{item.followers}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderLiveEvent = ({ item }: { item: LiveEvent }) => (
    <TouchableOpacity
      style={styles.liveCard}
      onPress={() => navigation.navigate('LiveStream' as any, { eventId: item.id })}
    >
      <Image
        source={{ uri: item.thumbnailUrl || 'https://via.placeholder.com/300x200' }}
        style={styles.liveImage}
      />
      <View style={styles.liveOverlay}>
        <View style={styles.liveBadge}>
          <Icon name="live-tv" size={12} color={COLORS.white} />
          <Text style={styles.liveBadgeText}>LIVE</Text>
        </View>
        <Text style={styles.liveViewers}>{item.viewerCount} watching</Text>
      </View>
      <View style={styles.liveContent}>
        <Text style={styles.liveTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.liveLanguage}>{item.language}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFeaturedItem = ({ item }: { item: MarketplaceItem }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => navigation.navigate('MarketplaceItem' as any, { itemId: item.id })}
    >
      <Image
        source={{ uri: item.images[0] || 'https://via.placeholder.com/200x200' }}
        style={styles.featuredImage}
      />
      <View style={styles.featuredContent}>
        <Text style={styles.featuredTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.featuredPrice}>₹{item.price}</Text>
        <View style={styles.featuredRating}>
          <Icon name="star" size={12} color={COLORS.warning} />
          <Text style={styles.featuredRatingText}>{item.rating.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const quickActions = [
    {
      id: '1',
      title: 'Live Events',
      icon: 'live-tv',
      gradient: [COLORS.error, '#FF6B9D'],
      onPress: () => navigation.navigate('Live' as any),
    },
    {
      id: '2',
      title: 'Book Service',
      icon: 'event',
      gradient: [COLORS.primary, '#A0522D'],
      onPress: () => navigation.navigate('Bookings' as any),
    },
    {
      id: '3',
      title: 'Marketplace',
      icon: 'shopping-bag',
      gradient: [COLORS.success, '#00E676'],
      onPress: () => navigation.navigate('Marketplace' as any),
    },
    {
      id: '4',
      title: 'Donate',
      icon: 'favorite',
      gradient: [COLORS.accent, '#FFD700'],
      onPress: () => navigation.navigate('Donations' as any),
    },
    {
      id: '5',
      title: 'Travel Plan',
      icon: 'map',
      gradient: [COLORS.info, '#42A5F5'],
      onPress: () => navigation.navigate('Travel' as any),
    },
    {
      id: '6',
      title: 'Community',
      icon: 'groups',
      gradient: [COLORS.secondary, '#9C27B0'],
      onPress: () => navigation.navigate('Community' as any),
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <LinearGradient
        colors={COLORS.primaryGradient}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={openDrawer}>
            <Icon name="menu" size={24} color={COLORS.white} />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <View style={styles.locationContainer}>
              <Icon name="location-on" size={16} color={COLORS.white} />
              <Text style={styles.locationText}>{currentLocation}</Text>
            </View>
            <Text style={styles.greeting}>Good morning, User!</Text>
          </View>
          
          <TouchableOpacity onPress={() => navigation.navigate('Notifications' as any)}>
            <Icon name="notifications" size={24} color={COLORS.white} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <FlatList
            data={quickActions}
            renderItem={renderQuickAction}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsContainer}
          />
        </View>

        {/* Live Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Now</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Live' as any)}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={liveEvents}
            renderItem={renderLiveEvent}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Nearby Places */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sacred Places Near You</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Explore' as any)}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={nearbyPlaces}
            renderItem={renderNearbyPlace}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Featured Marketplace Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Items</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Marketplace' as any)}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredItems}
            renderItem={renderFeaturedItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>
      </ScrollView>
    </View>
  );
};

// Mock data functions
const getMockNearbyPlaces = (): PlaceOfWorship[] => [
  {
    id: '1',
    name: 'Lotus Temple',
    type: 'temple',
    address: 'Lotus Temple Rd, Bahapur',
    coordinates: { latitude: 28.5535, longitude: 77.2588 },
    images: ['https://via.placeholder.com/300x200'],
    description: 'Beautiful lotus-shaped temple',
    history: 'Built in 1986',
    languages: ['Hindi', 'English'],
    timings: { monday: { open: '9:00', close: '19:00' } },
    contact: { phone: '+91-11-26444029' },
    priests: [],
    followers: 1250,
    rating: 4.8,
    reviews: [],
    amenities: ['Parking', 'Garden'],
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // Add more mock places...
];

const getMockLiveEvents = (): LiveEvent[] => [
  {
    id: '1',
    placeOfWorshipId: '1',
    title: 'Evening Aarti at Golden Temple',
    description: 'Join the divine evening prayers',
    type: 'prayer',
    startTime: '2024-01-15T18:00:00Z',
    streamUrl: 'https://example.com/stream1',
    thumbnailUrl: 'https://via.placeholder.com/300x200',
    isLive: true,
    viewerCount: 524,
    likes: 156,
    comments: [],
    language: 'Punjabi',
    tags: ['prayer', 'golden-temple'],
    admSettings: { showAds: true, adFrequency: 300 },
  },
  // Add more mock events...
];

const getMockFeaturedItems = (): MarketplaceItem[] => [
  {
    id: '1',
    placeOfWorshipId: '1',
    sellerId: 'seller1',
    title: 'Sacred Rudraksha Mala',
    description: 'Authentic 108 beads rudraksha mala',
    category: 'artifacts',
    images: ['https://via.placeholder.com/200x200'],
    price: 299,
    currency: 'INR',
    inStock: 15,
    rating: 4.5,
    reviews: [],
    shippingInfo: {
      weight: 0.1,
      dimensions: { length: 10, width: 5, height: 2 },
      freeShipping: true,
    },
    isDigital: false,
    createdAt: '2024-01-01T00:00:00Z',
  },
  // Add more mock items...
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: SPACING.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  locationText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    marginLeft: SPACING.xs,
  },
  greeting: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginTop: -10,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  section: {
    marginVertical: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.gray[800],
  },
  seeAllText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  quickActionsContainer: {
    paddingHorizontal: SPACING.lg,
  },
  quickActionCard: {
    marginRight: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionGradient: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    minWidth: 100,
  },
  quickActionText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  horizontalList: {
    paddingHorizontal: SPACING.lg,
  },
  placeCard: {
    width: CARD_WIDTH * 0.8,
    marginRight: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  placeImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
  },
  placeOverlay: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeReligionIcon: {
    fontSize: 20,
  },
  placeContent: {
    padding: SPACING.md,
  },
  placeName: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.gray[800],
    marginBottom: SPACING.xs,
  },
  placeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  placeAddress: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    marginLeft: SPACING.xs,
    flex: 1,
  },
  placeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    marginLeft: SPACING.xs,
  },
  liveCard: {
    width: CARD_WIDTH * 0.7,
    marginRight: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  liveImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
  },
  liveOverlay: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    right: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  liveBadgeText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
  liveViewers: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  liveContent: {
    padding: SPACING.md,
  },
  liveTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.gray[800],
    marginBottom: SPACING.xs,
  },
  liveLanguage: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
  },
  featuredCard: {
    width: 140,
    marginRight: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: BORDER_RADIUS.md,
    borderTopRightRadius: BORDER_RADIUS.md,
  },
  featuredContent: {
    padding: SPACING.sm,
  },
  featuredTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[800],
    marginBottom: SPACING.xs,
  },
  featuredPrice: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  featuredRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredRatingText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[600],
    marginLeft: SPACING.xs,
  },
});

export default HomeScreen;