const colors = [
    [217, 40, 100],
    [40, 125, 175],
    [0, 200, 245],
    [245, 175, 25],
    [245, 150, 200],
    [155, 89, 182],
    [255, 0, 255],
    [240, 128, 128],
    [255, 255, 0],
    [0, 128, 128],
    [128, 0, 0],
    [0, 255, 255],
    [128, 128, 128],
    [255, 165, 0]
]

// Table object
function Table(element, size = 4) {
    this.element = element
    this.size = size
    this.pointsElement = document.querySelector('#points')
    this.points = 0
    this.tiles = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
    this.endOfRound = () => {
            for (var row = 0; row < this.size; row++) {
                for (var col = 0; col < this.size; col++) {
                    const tile = this.tiles[row][col]
                    tile && tile.setIncreasable(true)
                }
            }
        }
        // Spawn new tile on a random location
    this.spawnNewTile = async() => {
        let emptyNumber = table.countEmpty()
        let location = Math.round(emptyNumber * Math.random())
        let counter = 0
        let value = 1
        if (Math.random() <= 0.1)
            value = 2

        for (let i = 0; i < this.size * this.size; i++) {
            let x = i % 4
            let y = Math.floor(i / 4)
            if (table.tiles[x][y]) {
                continue
            } else {
                counter++
            }
            if (location == counter)
                table.addTile(x, y, value)
        }
        table.updatePoints()
    }

    this.addTile = (x, y, initialValue) => {
        let tileElement = document.createElement('div')
        tileElement.classList.add('tile', 'faded')
        requestAnimationFrame(() => {
            tileElement.classList.remove('faded')
        })
        let tile = new Tile(tileElement, initialValue)
        tile.x = x
        tile.y = y
        this.tiles[x][y] = tile
        tableDiv.appendChild(tileElement)
        setElementLocation(tileElement, x, y)
        return tile
    }
    this.print = () => {
        for (let row = 0; row < this.size; row++) {
            var str = ""
            for (let col = 0; col < this.size; col++) {
                let tile = table.tiles[row][col]
                let val = tile ? tile.value : "0"
                str += val + " "
            }
            console.log(str)
        }
    }
    this.updatePoints = () => {
            this.points = 0
            for (let col = 0; col < this.size; col++) {
                for (let row = 0; row < this.size; row++) {
                    var tile = this.tiles[row][col]
                    if (tile)
                        this.points += Math.pow(2, tile.value)
                }
            }
            this.pointsElement.innerHTML = this.points;
        }
        // Count the empty tiles
    this.countEmpty = () => {
            counter = 0
            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    if (!this.tiles[i][j]) {
                        counter++
                    }
                }
            }
            return counter
        }
        // Create placeholders
    for (let i = 0; i < this.size * this.size; i++) {
        let placeHolder = document.createElement('div')
        placeHolder.className = "placeHolder"
        this.element.appendChild(placeHolder)
    }
}

// Tile object
function Tile(element, initialValue) {
    this.value = initialValue
    this.element = element
    this.markers = []
    this.x = 0
    this.y = 0

    this.addMarker = (marker) => {
        this.markers.push(marker)
    }

    this.removeMarker = (marker) => {
        const index = this.markers.indexOf(marker)
        if (index < 0) return
        this.markers.splice(index, 1)
    }

    this.hasMarker = (marker) => {
        return this.markers.includes(marker)
    }

    this.isIncreasable = () => {
        return !this.hasMarker('increased')
    }

    this.setIncreasable = (state) => {
        if (state) this.removeMarker('increased')
        else this.addMarker('increased')
    }

    this.increase = () => {
        this.setValue(++this.value)
        return this
    }

    this.destruct = () => {
        this.element.remove(this)
        table.tiles[this.x][this.y] = 0
    }

    this.setValue = (value) => {
        this.element.innerHTML = Math.pow(2, value)
        const currentColor = colors[value - 1]
        element.style.backgroundColor = `rgba(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]},1)`
    }

    this.moveTo = (x, y) => {
        table.tiles[this.x][this.y] = 0
        table.tiles[x][y] = this
        this.x = x
        this.y = y
        setElementLocation(this.element, x, y)
    }

    this.keepUp = () => {
        if (this.x == 0) return false
        for (let currentX = this.x; 0 <= currentX; currentX--) {
            const nextX = currentX - 1
            if (nextX == -1 || table.tiles[nextX][this.y]) {
                if (nextX != -1 && table.tiles[nextX][this.y].value == this.value && this.isIncreasable() && table.tiles[nextX][this.y].isIncreasable) {
                    table.tiles[nextX][this.y].destruct()
                    this.moveTo(nextX, this.y)
                    this.increase()
                    this.setIncreasable(false)
                    return true
                }
                if (currentX != this.x) {
                    this.moveTo(currentX, this.y)
                    return true
                } else {
                    return false
                }
            }
        }
        return false
    }
    this.keepDown = () => {
        if (this.x == 3) return false
        for (let currentX = this.x; currentX <= 3; currentX++) {
            const nextX = currentX + 1
            if (nextX == table.size || table.tiles[nextX][this.y]) {
                if (nextX != table.size && table.tiles[nextX][this.y].value == this.value && this.isIncreasable() && table.tiles[nextX][this.y].isIncreasable) {
                    table.tiles[nextX][this.y].destruct()
                    this.moveTo(nextX, this.y)
                    this.increase()
                    this.setIncreasable(false)
                    return true
                }
                if (currentX != this.x) {
                    this.moveTo(currentX, this.y)
                    return true
                } else {
                    return false
                }
            }
        }
        return false
    }
    this.keepLeft = () => {
        if (this.y == 0) return false
        for (let currentY = this.y; 0 <= currentY; currentY--) {
            const nextY = currentY - 1
            if (nextY == -1 || table.tiles[this.x][nextY]) {
                if (nextY != -1 && table.tiles[this.x][nextY].value == this.value && this.isIncreasable() && table.tiles[this.x][nextY].isIncreasable) {
                    table.tiles[this.x][nextY].destruct()
                    this.moveTo(this.x, nextY)
                    this.increase()
                    this.setIncreasable(false)
                    return true
                }
                if (currentY != this.y) {
                    this.moveTo(this.x, currentY)
                    return true
                } else {
                    return false
                }
            }
        }
        return false
    }
    this.keepRight = () => {
        if (this.y == 3) return false
        for (let currentY = this.y; currentY <= 3; currentY++) {
            const nextY = currentY + 1
            if (nextY == table.size || table.tiles[this.x][nextY]) {
                if (nextY != table.size && table.tiles[this.x][nextY].value == this.value && this.isIncreasable() && table.tiles[this.x][nextY].isIncreasable) {
                    table.tiles[this.x][nextY].destruct()
                    this.moveTo(this.x, nextY)
                    this.increase()
                    this.setIncreasable(false)
                    return true
                }
                if (currentY != this.y) {
                    this.moveTo(this.x, currentY)
                    return true
                } else {
                    return false
                }
            }
        }
        return false
    }
    this.setValue(initialValue)
}

// Set up key listeners
document.addEventListener('keydown', (event) => {
    var name = event.key
    var isMovement = false
    switch (name) {
        case 'ArrowUp':
            for (let col = 0; col < 4; col++) {
                for (let row = 0; row < 4; row++) {
                    let tile = table.tiles[row][col]
                    if (!tile) continue
                    var didMove = tile.keepUp()
                    if (!isMovement && didMove)
                        isMovement = true
                }
            }
            break
        case 'ArrowDown':
            for (let col = 0; col < 4; col++) {
                for (let row = 3; 0 <= row; row--) {
                    let tile = table.tiles[row][col]
                    if (!tile) continue
                    var didMove = tile.keepDown()
                    if (!isMovement && didMove)
                        isMovement = true
                }
            }
            break
        case 'ArrowRight':
            for (let row = 0; row < 4; row++) {
                for (let col = 3; 0 <= col; col--) {
                    let tile = table.tiles[row][col]
                    if (!tile) continue
                    var didMove = tile.keepRight()
                    if (!isMovement && didMove)
                        isMovement = true
                }
            }
            break
        case 'ArrowLeft':
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    let tile = table.tiles[row][col]
                    if (!tile) continue
                    var didMove = tile.keepLeft()
                    if (!isMovement && didMove)
                        isMovement = true
                }
            }
            break
        default:
            return
    }
    isMovement && table.spawnNewTile()
    table.updatePoints()
    table.endOfRound()
}, 0)

// Moves html element to given position
function setElementLocation(element, x, y) {
    // Calculate offsets
    var tableSize = parseInt(getComputedStyle(table.element).width)
    var tileSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--tile-size'))
    var innerShit = (tableSize - 4 * tileSize) / 8
    var minX = parseInt(getComputedStyle(table.element).marginTop) + parseInt(getComputedStyle(table.element).paddingTop) + innerShit
    var maxX = minX + 6 * innerShit + 3 * tileSize
    var minY = parseInt(getComputedStyle(table.element).marginLeft) + parseInt(getComputedStyle(table.element).paddingLeft) + innerShit
    var maxY = minY + 6 * innerShit + 3 * tileSize
    let posX = minX + (maxX - minX) * x / 3
    let posY = minY + (maxY - minY) * y / 3
    element.style.top = posX + 'px'
    element.style.left = posY + 'px'
}

/* Starting point */

let tableDiv = document.querySelector('#table')
let table = new Table(tableDiv, 4)
table.spawnNewTile()