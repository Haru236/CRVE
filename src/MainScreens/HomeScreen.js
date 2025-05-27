import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator,
  StyleSheet, Dimensions, SectionList, ScrollView
} from 'react-native';
import { collectionGroup, getDocs, collection } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext'; // ✅ import Cart context

const PIZZA_SIZES = ['Small', 'Medium', 'Large'];
const SCREEN_WIDTH = Dimensions.get('window').width;

const HomeScreen = () => {
  const navigation = useNavigation();
  const { addToCart } = useCart(); // ✅ use cart context

  const [allItems, setAllItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pizzaSelection, setPizzaSelection] = useState({});
  const [restaurantStatus, setRestaurantStatus] = useState({});
  const [popupMessage, setPopupMessage] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [expandedRestaurants, setExpandedRestaurants] = useState({});

  const fetchItemsAndStatus = async () => {
    try {
      const q = collectionGroup(db, 'items');
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ref: doc.ref,
        ...doc.data(),
      }));
      setAllItems(items);

      const statusQuery = await getDocs(collection(db, 'restaurants'));
      const statusMap = {};
      statusQuery.forEach(doc => {
        const data = doc.data();
        if (data.name) statusMap[data.name] = data.status || 'open';
      });
      setRestaurantStatus(statusMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchItemsAndStatus();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchItemsAndStatus();
  }, []);

  const showPopup = (message) => {
    setPopupMessage(message);
    setPopupVisible(true);
    setTimeout(() => setPopupVisible(false), 3000);
  };

  const getImageUri = (base64Str) => {
    if (!base64Str) return null;
    if (base64Str.startsWith('data:image')) return base64Str;
    return `data:image/jpeg;base64,${base64Str}`;
  };

  const changeQty = (id, delta) => {
    const newQty = Math.max(1, (pizzaSelection[id]?.qty || 1) + delta);
    setPizzaSelection(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        qty: newQty,
        veg: prev[id]?.veg ?? true,
        size: prev[id]?.size || 'Medium',
      },
    }));
  };

  const setVegType = (id, veg) => {
    setPizzaSelection(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        veg,
        qty: prev[id]?.qty || 1,
        size: prev[id]?.size || 'Medium',
      },
    }));
  };

  const setPizzaSize = (id, size) => {
    setPizzaSelection(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        size,
        qty: prev[id]?.qty || 1,
        veg: prev[id]?.veg ?? true,
      },
    }));
  };

  const handleAddToCart = (item) => {
    const restaurantOpen = restaurantStatus[item.restaurantName] !== 'closed';
    if (!item.available || !restaurantOpen) return;

    const selection = pizzaSelection[item.id] || {};
    const qty = selection.qty || 1;
    const size = selection.size || 'Medium';
    const veg = selection.veg ?? true;

    // Determine size price adjustment (for pizza)
    let basePrice = item.price;
    if (item.category?.toLowerCase() === 'pizza') {
      if (size === 'Small') basePrice = item.price;
      if (size === 'Medium') basePrice = item.price + 30;
      if (size === 'Large') basePrice = item.price + 60;
    }

    const orderDetails = {
      id: item.id,
      name: item.name,
      imageBase64: item.imageBase64 || null,
      qty,
      veg,
      size,
      pricePerUnit: basePrice,
      totalPrice: qty * basePrice,
      restaurantName: item.restaurantName,
    };

    addToCart(orderDetails);
    showPopup('✔️ Item added to cart. Tap to view.');
  };

  const filteredItems = allItems.filter(item => {
    const matchSearch = item.name?.toLowerCase().includes(search.toLowerCase()) ||
                        item.restaurantName?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'all' || item.category?.toLowerCase() === selectedCategory;
    return matchSearch && matchCategory;
  });

  const itemsByRestaurant = filteredItems.reduce((acc, item) => {
    const rest = item.restaurantName || 'Unknown';
    if (!acc[rest]) acc[rest] = [];
    acc[rest].push(item);
    return acc;
  }, {});

  const allCategories = Array.from(new Set(allItems.map(item => item.category?.toLowerCase() || 'others')));

  const toggleExpand = (restaurant) => {
    setExpandedRestaurants(prev => ({
      ...prev,
      [restaurant]: !prev[restaurant],
    }));
  };

  const renderItemCard = (item, restaurantOpen) => {
    const isUnavailable = !item.available || !restaurantOpen;
    const category = item.category?.toLowerCase() || '';
    const showVegToggle = category === 'pizza' || category === 'burger';
    const showSizeSelector = category === 'pizza';

    return (
      <View key={item.id} style={styles.itemCard}>
        {getImageUri(item.imageBase64) ? (
          <Image source={{ uri: getImageUri(item.imageBase64) }} style={styles.itemImage} />
        ) : (
          <View style={[styles.itemImage, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text>No Image</Text>
          </View>
        )}
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
        <Text style={[styles.statusText, { color: item.available ? 'green' : 'red' }]}>
          {item.available ? 'Available' : 'Unavailable'}
        </Text>

        {showVegToggle && (
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, pizzaSelection[item.id]?.veg === true && styles.toggleButtonActive]}
              onPress={() => setVegType(item.id, true)}
              disabled={isUnavailable}
            >
              <Text style={pizzaSelection[item.id]?.veg === true ? styles.toggleTextActive : styles.toggleText}>
                Veg
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, pizzaSelection[item.id]?.veg === false && styles.toggleButtonActive]}
              onPress={() => setVegType(item.id, false)}
              disabled={isUnavailable}
            >
              <Text style={pizzaSelection[item.id]?.veg === false ? styles.toggleTextActive : styles.toggleText}>
                Non-Veg
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {showSizeSelector && (
          <View style={styles.sizeSelector}>
            {PIZZA_SIZES.map(size => (
              <TouchableOpacity
                key={size}
                style={[styles.sizeOption, pizzaSelection[item.id]?.size === size && styles.sizeOptionActive]}
                onPress={() => setPizzaSize(item.id, size)}
                disabled={isUnavailable}
              >
                <Text style={pizzaSelection[item.id]?.size === size ? styles.sizeTextActive : styles.sizeText}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.qtyContainer}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(item.id, -1)} disabled={isUnavailable}>
            <Text style={styles.qtyBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{pizzaSelection[item.id]?.qty || 1}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(item.id, 1)} disabled={isUnavailable}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.addBtn, isUnavailable && { backgroundColor: '#ccc' }]}
          onPress={() => handleAddToCart(item)}
          disabled={isUnavailable}
        >
          <Text style={styles.addBtnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ff6347" />
      </View>
    );
  }

  const sections = Object.entries(itemsByRestaurant).map(([restaurant, items]) => ({
    title: restaurant,
    data: [items],
  }));

  return (
    <View style={styles.container}>
      {popupVisible && (
        <TouchableOpacity style={styles.popup} onPress={() => navigation.navigate('UserCartScreen')}>
          <Text style={styles.popupText}>{popupMessage}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search for items or restaurants..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.categoryBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => setSelectedCategory('all')}
            style={[styles.categoryBtn, selectedCategory === 'all' && styles.categoryBtnActive]}
          >
            <Text style={[styles.categoryText, selectedCategory === 'all' && styles.categoryTextActive]}>All</Text>
          </TouchableOpacity>
          {allCategories.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[styles.categoryBtn, selectedCategory === cat && styles.categoryBtnActive]}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id + index}
        stickySectionHeadersEnabled
        renderSectionHeader={({ section: { title } }) => (
          <TouchableOpacity
            onPress={() => toggleExpand(title)}
            style={styles.sectionHeader}
          >
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.expandIcon}>
              {expandedRestaurants[title] ? '-' : '+'}
            </Text>
          </TouchableOpacity>
        )}
        renderItem={({ section }) => {
          const restaurantName = section.title;
          if (!expandedRestaurants[restaurantName]) return null;

          return (
            <View style={styles.itemsContainer}>
              {section.data[0].map(item => renderItemCard(item, restaurantStatus[restaurantName] !== 'closed'))}
            </View>
          );
        }}
        onRefresh={onRefresh}
        refreshing={refreshing}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  popup: {
    position: 'absolute',
    top: 40,
    left: SCREEN_WIDTH * 0.05,
    right: SCREEN_WIDTH * 0.05,
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    zIndex: 100,
    opacity: 0.9,
  },
  popupText: { color: '#fff', textAlign: 'center', fontWeight: '600' },

  searchBox: {
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  searchInput: { fontSize: 16 },

  categoryBar: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  categoryBtn: {
    marginRight: 12,
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  categoryBtnActive: {
    backgroundColor: '#ff6347',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '700',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ff6347',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  expandIcon: { color: '#fff', fontSize: 24 },

  itemsContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
  },

  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 12,
    padding: 15,
    elevation: 3,
  },
  itemImage: {
    width: '100%',
    height: 170,
    borderRadius: 15,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 3,
  },
  itemPrice: {
    fontSize: 18,
    color: '#333',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '600',
  },

  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ff6347',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#ff6347',
  },
  toggleText: {
    color: '#ff6347',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

  sizeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  sizeOption: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ff6347',
    marginHorizontal: 7,
  },
  sizeOptionActive: {
    backgroundColor: '#ff6347',
  },
  sizeText: {
    color: '#ff6347',
    fontWeight: '600',
  },
  sizeTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  qtyBtn: {
    width: 35,
    height: 35,
    backgroundColor: '#ff6347',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '700',
    lineHeight: 25,
  },
  qtyText: {
    marginHorizontal: 20,
    fontSize: 22,
    fontWeight: '700',
  },

  addBtn: {
    backgroundColor: '#ff6347',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default HomeScreen;
