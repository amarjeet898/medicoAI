import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Colors } from '../constants/Colors';

interface MarkdownRendererProps {
  content: string;
  style?: any;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, style }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Process LaTeX math in the content
  const processedContent = processLatexMath(content);

  const markdownStyles = {
    body: {
      color: colors.text,
      fontSize: 16,
      lineHeight: 24,
    },
    heading1: {
      color: colors.tint,
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
      marginTop: 16,
    },
    heading2: {
      color: colors.tint,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 6,
      marginTop: 12,
    },
    heading3: {
      color: colors.tint,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
      marginTop: 8,
    },
    paragraph: {
      marginBottom: 8,
      color: colors.text,
    },
    strong: {
      fontWeight: 'bold',
      color: colors.text,
    },
    em: {
      fontStyle: 'italic',
      color: colors.text,
    },
    code_inline: {
      backgroundColor: colors.backgroundInput,
      color: colors.text,
      fontFamily: 'monospace',
      fontSize: 14,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 3,
    },
    code_block: {
      backgroundColor: colors.backgroundInput,
      color: colors.text,
      fontFamily: 'monospace',
      fontSize: 14,
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
    },
    fence: {
      backgroundColor: colors.backgroundInput,
      color: colors.text,
      fontFamily: 'monospace',
      fontSize: 14,
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
    },
    blockquote: {
      backgroundColor: colors.backgroundInput,
      borderLeftWidth: 4,
      borderLeftColor: colors.tint,
      paddingLeft: 12,
      paddingVertical: 8,
      marginVertical: 8,
      fontStyle: 'italic',
    },
    list_item: {
      color: colors.text,
      marginBottom: 4,
    },
    bullet_list: {
      marginVertical: 8,
    },
    ordered_list: {
      marginVertical: 8,
    },
    table: {
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderRadius: 8,
      marginVertical: 8,
    },
    thead: {
      backgroundColor: colors.backgroundInput,
    },
    tbody: {
      backgroundColor: colors.cardBackground,
    },
    th: {
      fontWeight: 'bold',
      color: colors.text,
      padding: 8,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    td: {
      color: colors.text,
      padding: 8,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    link: {
      color: colors.tint,
      textDecorationLine: 'underline',
    },
    hr: {
      backgroundColor: colors.borderColor,
      height: 1,
      marginVertical: 16,
    },
  };

  return (
    <View style={[styles.container, style]}>
      <Markdown style={markdownStyles}>
        {processedContent}
      </Markdown>
    </View>
  );
};

// Process LaTeX math expressions and convert them to readable format
function processLatexMath(content: string): string {
  // Handle inline math \\( ... \\)
  content = content.replace(/\\\((.*?)\\\)/g, (match, math) => {
    return `*${convertLatexToText(math)}*`;
  });

  // Handle block math \\[ ... \\]
  content = content.replace(/\\\[(.*?)\\\]/g, (match, math) => {
    return `\n\n**${convertLatexToText(math)}**\n\n`;
  });

  // Handle dollar sign math $ ... $
  content = content.replace(/\$([^$]+)\$/g, (match, math) => {
    return `*${convertLatexToText(math)}*`;
  });

  // Handle double dollar sign math $$ ... $$
  content = content.replace(/\$\$(.*?)\$\$/g, (match, math) => {
    return `\n\n**${convertLatexToText(math)}**\n\n`;
  });

  return content;
}

// Convert common LaTeX symbols to Unicode or readable text
function convertLatexToText(latex: string): string {
  const latexToUnicode: { [key: string]: string } = {
    // Greek letters
    '\\alpha': 'α',
    '\\beta': 'β',
    '\\gamma': 'γ',
    '\\delta': 'δ',
    '\\epsilon': 'ε',
    '\\theta': 'θ',
    '\\lambda': 'λ',
    '\\mu': 'μ',
    '\\pi': 'π',
    '\\sigma': 'σ',
    '\\phi': 'φ',
    '\\chi': 'χ',
    '\\omega': 'ω',
    '\\Delta': 'Δ',
    '\\Theta': 'Θ',
    '\\Lambda': 'Λ',
    '\\Sigma': 'Σ',
    '\\Phi': 'Φ',
    '\\Omega': 'Ω',

    // Mathematical operators
    '\\times': '×',
    '\\cdot': '·',
    '\\div': '÷',
    '\\pm': '±',
    '\\mp': '∓',
    '\\neq': '≠',
    '\\leq': '≤',
    '\\geq': '≥',
    '\\approx': '≈',
    '\\propto': '∝',
    '\\infty': '∞',
    '\\partial': '∂',
    '\\nabla': '∇',
    '\\int': '∫',
    '\\sum': '∑',
    '\\prod': '∏',
    '\\sqrt': '√',
    '\\therefore': '∴',
    '\\because': '∵',
    '\\angle': '∠',
    '\\parallel': '∥',
    '\\perp': '⊥',

    // Set theory
    '\\in': '∈',
    '\\notin': '∉',
    '\\subset': '⊂',
    '\\subseteq': '⊆',
    '\\cup': '∪',
    '\\cap': '∩',
    '\\emptyset': '∅',
    '\\forall': '∀',
    '\\exists': '∃',

    // Logic
    '\\neg': '¬',
    '\\wedge': '∧',
    '\\vee': '∨',
    '\\Rightarrow': '⇒',
    '\\Leftrightarrow': '⇔',

    // Arrows
    '\\rightarrow': '→',
    '\\leftarrow': '←',
    '\\uparrow': '↑',
    '\\downarrow': '↓',

    // Fractions (simplified)
    '\\frac': '',
  };

  let result = latex;

  // Replace known LaTeX commands
  for (const [latexCmd, unicode] of Object.entries(latexToUnicode)) {
    result = result.replace(new RegExp(latexCmd.replace(/\\/g, '\\\\'), 'g'), unicode);
  }

  // Handle fractions \\frac{num}{den}
  result = result.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');

  // Handle superscripts ^{...}
  result = result.replace(/\^?\{([^}]+)\}/g, '^($1)');

  // Handle subscripts _{...}
  result = result.replace(/_\{([^}]+)\}/g, '_($1)');

  // Handle simple superscripts ^x
  result = result.replace(/\^([a-zA-Z0-9])/g, '^$1');

  // Handle simple subscripts _x
  result = result.replace(/_([a-zA-Z0-9])/g, '_$1');

  // Clean up remaining backslashes
  result = result.replace(/\\/g, '');

  return result.trim();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MarkdownRenderer;