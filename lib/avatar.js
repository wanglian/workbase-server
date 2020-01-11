Avatar.setOptions({
  generateCSS: false,
  imageSizes: {
    'profile': 180,
    'xlarge': 90,
    'large': 65,
    'mlarge': 45,
    'medium': 40,
    'small': 35,
    'tiny': 30,
  },
  backgroundColor: "#FFF",
  textColor(user) {
    return "#777";
  },
  customImageProperty() {
    return this.profile && this.profile.avatar || '/assets/avatar.png';
  }
});