import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { supabase } from '../lib/supabase';
import Icon from 'react-native-vector-icons/Feather';

type AddContentScreenRouteProp = RouteProp<RootStackParamList, 'AddContent'>;
type AddContentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddContent'>;

interface AddContentScreenProps {
  route: AddContentScreenRouteProp;
  navigation: AddContentScreenNavigationProp;
}

const AddContentScreen: React.FC<AddContentScreenProps> = ({ route, navigation }) => {
  const { contentType } = route.params;
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [status, setStatus] = useState(contentType === 'movie' ? 'to_watch' : 'to_watch');
  const [rating, setRating] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const searchTMDb = async () => {
    if (!title) {
      Alert.alert('Erro', 'Digite um título para buscar');
      return;
    }

    try {
      setSearching(true);
      
      const endpoint = contentType === 'movie' ? 'movie' : 'tv';
      const response = await fetch(
        `https://api.themoviedb.org/3/search/${endpoint}?api_key=YOUR_TMDB_API_KEY&query=${encodeURIComponent(title)}&language=pt-BR`
      );
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        setSearchResults(data.results.slice(0, 5));
      } else {
        setSearchResults([]);
        Alert.alert('Nenhum resultado', 'Nenhum resultado encontrado para esta busca');
      }
    } catch (error) {
      console.error('Error searching TMDb:', error);
      Alert.alert('Erro', 'Erro ao buscar no TMDb');
    } finally {
      setSearching(false);
    }
  };

  const selectResult = (result: any) => {
    setTitle(contentType === 'movie' ? result.title : result.name);
    setYear(
      contentType === 'movie'
        ? result.release_date?.substring(0, 4) || ''
        : result.first_air_date?.substring(0, 4) || ''
    );
    setSearchResults([]);
  };

  const handleAddContent = async () => {
    if (!title || !year) {
      Alert.alert('Erro', 'Título e ano são obrigatórios');
      return;
    }

    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }

      const table = contentType === 'movie' ? 'movies' : 'series';
      
      const { error } = await supabase.from(table).insert({
        title,
        year,
        status,
        rating: rating ? parseInt(rating, 10) : null,
        user_id: user.id,
      });

      if (error) throw error;

      Alert.alert('Sucesso', 'Conteúdo adicionado com sucesso');
      navigation.goBack();
    } catch (error: any) {
      console.error('Error adding content:', error);
      Alert.alert('Erro', error.message || 'Erro ao adicionar conteúdo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Título</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Digite o título"
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.searchButton} onPress={searchTMDb}>
              {searching ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Icon name="search" size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>

          {searchResults.length > 0 && (
            <View style={styles.resultsContainer}>
              {searchResults.map((result) => (
                <TouchableOpacity
                  key={result.id}
                  style={styles.resultItem}
                  onPress={() => selectResult(result)}
                >
                  <Text style={styles.resultTitle}>
                    {contentType === 'movie' ? result.title : result.name}
                  </Text>
                  <Text style={styles.resultYear}>
                    {contentType === 'movie'
                      ? result.release_date?.substring(0, 4) || 'N/A'
                      : result.first_air_date?.substring(0, 4) || 'N/A'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.label}>Ano</Text>
          <TextInput
            style={styles.input}
            value={year}
            onChangeText={setYear}
            placeholder="Ano de lançamento"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={4}
          />

          <Text style={styles.label}>Status</Text>
          <View style={styles.statusContainer}>
            <TouchableOpacity
              style={[
                styles.statusButton,
                status === 'to_watch' && styles.statusButtonActive,
              ]}
              onPress={() => setStatus('to_watch')}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  status === 'to_watch' && styles.statusButtonTextActive,
                ]}
              >
                Quero Ver
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.statusButton,
                status === 'watching' && styles.statusButtonActive,
              ]}
              onPress={() => setStatus('watching')}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  status === 'watching' && styles.statusButtonTextActive,
                ]}
              >
                Vendo
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.statusButton,
                (status === 'watched' || status === 'completed') && styles.statusButtonActive,
              ]}
              onPress={() => setStatus(contentType === 'movie' ? 'watched' : 'completed')}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  (status === 'watched' || status === 'completed') && styles.statusButtonTextActive,
                ]}
              >
                Já Vi
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Avaliação (1-5)</Text>
          <TextInput
            style={styles.input}
            value={rating}
            onChangeText={(text) => {
              const num = parseInt(text, 10);
              if (!text) {
                setRating('');
              } else if (!isNaN(num) && num >= 1 && num <= 5) {
                setRating(num.toString());
              }
            }}
            placeholder="Avaliação (opcional)"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={1}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddContent}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.addButtonText}>Adicionar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  formContainer: {
    padding: 16,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 4,
    padding: 12,
    color: 'white',
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
  },
  searchButton: {
    backgroundColor: '#E50914',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  resultsContainer: {
    backgroundColor: '#333',
    borderRadius: 4,
    marginTop: 8,
    maxHeight: 200,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  resultTitle: {
    color: 'white',
    fontSize: 14,
  },
  resultYear: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#333',
    borderRadius: 4,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#E50914',
  },
  statusButtonText: {
    color: '#CCC',
    fontSize: 14,
  },
  statusButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#E50914',
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddContentScreen;