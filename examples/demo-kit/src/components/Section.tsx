import React, { type PropsWithChildren } from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface SectionProps extends PropsWithChildren {
  title?: string;
  required?: boolean;
  hideSeparator?: boolean;
}

const GAP = 16;

export function Section({
  children,
  title,
  required = false,
  hideSeparator = false,
}: SectionProps): React.ReactElement {
  return (
    <View style={styles.section}>
      {title ? (
        <Text style={styles.sectionTitle}>
          {title}
          {required ? <Text style={styles.required}>{'*'}</Text> : null}
        </Text>
      ) : null}
      {children}
      {hideSeparator ? null : <View style={styles.separator} />}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
    paddingHorizontal: GAP,
    marginBottom: GAP,
  },
  sectionTitle: {
    marginBottom: GAP,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginTop: GAP,
  },
  required: {
    fontWeight: 'bold',
    color: 'tomato',
  },
});
