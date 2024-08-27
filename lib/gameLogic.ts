export function processEffects(effectsString: string) {
  const effects = effectsString.split('\n');
  const characterUpdates: Record<string, number> = {};
  const inventoryChanges: string[] = [];

  effects.forEach(effect => {
    const [type, value] = effect.split(':').map(s => s.trim());
    if (type === 'inventory') {
      const items = value.split(',').map(s => s.trim());
      items.forEach(item => {
        const [sign, itemName] = item.split(' ');
        if (sign === '+') inventoryChanges.push(itemName);
        else if (sign === '-') inventoryChanges.push(`-${itemName}`);
      });
    } else {
      characterUpdates[type] = parseInt(value);
    }
  });

  return { characterUpdates, inventoryChanges };
}