VERSION=0.0.2
RELEASE=stable

echo "-- version: $VERSION - $RELEASE"

echo "-- meteor npm install --production"
meteor npm install --production

echo "-- meteor build ./.snapcraft --server-only"
meteor build ./.snapcraft --server-only # workbase.tar.gz

cd .snapcraft
echo "-- snapcraft clean"
snapcraft clean

echo "-- snapcraft"
snapcraft

echo "snapcraft push workbase-server_${VERSION}_amd64.snap --release $RELEASE"
snapcraft push workbase-server_${VERSION}_amd64.snap --release $RELEASE
