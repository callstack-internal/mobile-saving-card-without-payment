import React, { useCallback, useState } from 'react';
import { Alert, Button, StyleSheet, View, TextInput } from 'react-native';
import {
  BillingDetails,
  CardDetails,
  CardField,
  useConfirmSetupIntent,
} from 'react-native-stripe-sdk';
import { API_URL } from './Config';

const defaultCard = {
  cardNumber: '4000000000003238',
  cvc: '424',
  expiryMonth: 1,
  expiryYear: 22,
};

export const Example = () => {
  const [card, setCard] = useState<CardDetails | null>(defaultCard);
  const [email, setEmail] = useState('');

  // It  is also possible to use `useStripe` and than `stripe.confirmSetupIntent`
  // The only difference is that this appraoch will not have `loading` status support and `onError`, `onSuccess` callbacks
  // But the Promise returned by the method will work the same allowing to catch errors and success states
  const { confirmSetupIntent, loading } = useConfirmSetupIntent();

  const createSetupIntentOnBackend = useCallback(async () => {
    const response = await fetch(`${API_URL}/create-setup-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: '',
    });
    const { clientSecret } = await response.json();

    return clientSecret;
  }, []);

  const handlePayPress = useCallback(async () => {
    if (!card) {
      return;
    }

    try {
      // 1. Create setup intent on backend
      const clientSecret = await createSetupIntentOnBackend();

      // 2. Gather customer billing information (ex. email)
      const billingDetails: BillingDetails = {
        email,
        phone: '+48888000888',
        addressCity: 'Wrocław',
        addressCountry: 'PL',
        addressLine1: 'Bolesława Drobnera',
        addressLine2: '12/100',
        addressPostalCode: '50-257',
      }; // mocked data for tests

      // 3. Confirm setup intent
      const intent = await confirmSetupIntent(
        clientSecret,
        card,
        billingDetails,
      );
      Alert.alert(
        `Success: Setup intent created. Intent status: ${intent.status}`,
      );
    } catch (e) {
      Alert.alert(`Error code: ${e.code}\n${e.message}`);
      console.log('Setup intent creation error', e.message);
    }
  }, [card, confirmSetupIntent, createSetupIntentOnBackend, email]);

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={setEmail}
        style={styles.emailField}
        placeholder="email"
      />
      <CardField
        value={{
          cardNumber: '4242424242424242',
          cvc: '424',
          expiryMonth: 3,
          expiryYear: 22,
        }}
        postalCodeEnabled={false}
        onCardChange={(cardDetails) => {
          console.log('card details', cardDetails);
          setCard(cardDetails);
        }}
        style={styles.cardField}
      />
      <Button onPress={handlePayPress} title="Save" disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 64,
  },
  cardField: {
    width: '100%',
    height: 50,
  },
  emailField: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 6,
    marginVertical: 8,
  },
});
