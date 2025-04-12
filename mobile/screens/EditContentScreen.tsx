import React, { useState, useEffect } from 'react';
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

type EditContentScreenRouteProp = RouteProp<RootStackParamList, 'EditContent'>;
type EditContentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditContent'>;

interface EditContentScreenProps {
  route: EditContentScreenRouteProp;
  navigation: EditContentScreenNavigationProp;
}

const EditContentScreen: React.FC<EditContentScreenProps> = ({ route, navigation }) => {
  const { item } = route.params;
  const contentType = item.type;
  
  const [title, setTitle] = useState(item.title || '');
  const [year, setYear] = useState(item.year || '');
  const [status, setStatus] = useState(item.status || 'to_watch');
  const [rating, setRating] = useState(item.rating ? item.rating.toString() : '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: `Editar ${contentType === 'movie' ? 'Filme' : 'Série'}`,
    });
  }, [navigation, contentType]);

  const handleUpdateContent = async () => {
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
      
      const { error } = await supabase
        .from(table)
        .update({
          title,
          year,
          status,
          rating: rating ? parseInt(rating, 10) : null,
        })
        .eq('id', item.id)
        .eq('user_id', user.id);

      if (error) throw error;

      Alert.alert('Sucesso', 'Conteúdo atualizado com sucesso');
      navigation.goBack();
    } catch (error: any) {
      console.error('Error updating content:', error);
      Alert.alert('Erro', error.message || 'Erro ao atualizar conteúdo');
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
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Digite o título"
            placeholderTextColor="#999"
          />

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
            style={styles.updateButton}
            onPress={handleUpdateContent}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.updateButtonText}>Atualizar</Text>
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
  updateButton: {
    backgroundColor: '#E50914',
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditContentScreen;