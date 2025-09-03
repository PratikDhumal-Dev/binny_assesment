import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { addToCart, Product } from '../store/cartSlice';

// Mock data for 20 diamond jewellery products
const mockProducts: Product[] = [
  {
    id: 1,
    title: "Classic Solitaire Diamond Ring",
    price: 2500,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 2,
    title: "Princess Cut Diamond Earrings",
    price: 1800,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 3,
    title: "Vintage Diamond Necklace",
    price: 3200,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 4,
    title: "Modern Diamond Tennis Bracelet",
    price: 2100,
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 5,
    title: "Oval Cut Diamond Pendant",
    price: 1500,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 6,
    title: "Three Stone Diamond Ring",
    price: 2800,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 7,
    title: "Diamond Stud Earrings",
    price: 1200,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 8,
    title: "Art Deco Diamond Brooch",
    price: 4500,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 9,
    title: "Pear Shaped Diamond Ring",
    price: 2200,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 10,
    title: "Diamond Halo Engagement Ring",
    price: 3500,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 11,
    title: "Marquise Cut Diamond Earrings",
    price: 1900,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 12,
    title: "Diamond Infinity Necklace",
    price: 2800,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 13,
    title: "Cushion Cut Diamond Ring",
    price: 2400,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 14,
    title: "Diamond Cross Pendant",
    price: 1600,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 15,
    title: "Emerald Cut Diamond Ring",
    price: 3100,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 16,
    title: "Diamond Heart Pendant",
    price: 1400,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 17,
    title: "Asscher Cut Diamond Ring",
    price: 2600,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 18,
    title: "Diamond Flower Earrings",
    price: 1700,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 19,
    title: "Radiant Cut Diamond Ring",
    price: 2900,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop&crop=center",
  },
  {
    id: 20,
    title: "Diamond Star Pendant",
    price: 1800,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop&crop=center",
  },
];

const ProductListScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    Alert.alert('Success', `${product.title} added to cart!`);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddToCart(item)}
        >
          <Ionicons name="add-circle" size={24} color="#000" />
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Diamond Jewellery Collection</Text>
        <TouchableOpacity
          style={styles.deviceInfoIcon}
          onPress={() => navigation.navigate('DeviceInfo')}
        >
          <Ionicons name="information-circle" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={mockProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  deviceInfoIcon: {
    padding: 8,
  },
  productList: {
    padding: 10,
  },
  productCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#ffffff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#fff',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  addButtonText: {
    marginLeft: 5,
    color: '#000',
    fontWeight: '600',
  },
});

export default ProductListScreen;
