const React = {
    createElement: (tag, props, ...children) => {
        const element = { tag, props: { ...props, children } };

        if (typeof tag === "function") {
            try {
                return tag(props);
            } catch ({ promiseFunction, key }) {
                promiseFunction().then((data) => {
                    promiseCache.set(key, data);

                    rerender();
                });

                return { tag: "h1", props: { children: ["I am loading"] } };
            }
        }

        return element;
    },
};

const states = [];

let stateCursor = 0;

const useState = (initialState) => {
    const FROZEN_CURSOR = stateCursor;

    states[FROZEN_CURSOR] = states?.[FROZEN_CURSOR] ?? initialState;

    const setState = (newState) => {
        states[FROZEN_CURSOR] = newState;

        rerender();
    };

    stateCursor++;

    return [states[FROZEN_CURSOR], setState];
};

const DogImage = async () => {
    const image = fetch("https://dog.ceo/api/breeds/image/random")
        .then((r) => r.json())
        .then((payload) => payload.message);

    return <p>{image}</p>;
};

const promiseCache = new Map();

const createResource = (promiseFunction, key) => {
    if (promiseCache.has(key)) return promiseCache.get(key);

    throw { promiseFunction, key };
};

const App = () => {
    const [name, setName] = useState("anirudh");

    const [count, setCount] = useState(0);

    const image = createResource(
        () =>
            fetch("https://dog.ceo/api/breeds/image/random")
                .then((r) => r.json())
                .then((payload) => payload.message),
        "dogPhoto"
    );

    return (
        <div className="react learning" style={{ padding: "1rem" }}>
            <div>
                <div>{name}</div>
                <br />
                <input type="text" placeholder="name" value={name} onchange={(e) => setName(e.target.value)} />
            </div>
            <br />

            <div>{count}</div>
            <div>
                <button onclick={() => setCount(count + 1)}>+</button>
                <button onclick={() => setCount(count - 1)}>-</button>
            </div>
            <br />
            {/* <DogImage /> */}
            <img src={image} />
            <p>
                eligendi quam dolore placeat at ipsum, maxime ipsa beatae, eveniet porro laborum voluptate.
                <div>
                    fsafasfasfsafasf
                    <div>dasdasdasds</div>
                </div>
            </p>
            <span>Lorem, ipsum dolor.</span>
        </div>
    );
};

const render = (reactElementOrStringOrNumber, container) => {
    if (["string", "number"].includes(typeof reactElementOrStringOrNumber)) {
        container.appendChild(document.createTextNode(String(reactElementOrStringOrNumber)));
        return;
    }

    const actualDomElement = document.createElement(reactElementOrStringOrNumber.tag);

    if (reactElementOrStringOrNumber.props) {
        Object.keys(reactElementOrStringOrNumber.props)
            .filter((p) => p !== "children")
            .forEach((key) => (actualDomElement[key] = reactElementOrStringOrNumber.props[key]));
    }

    if (reactElementOrStringOrNumber.props.children) {
        reactElementOrStringOrNumber.props.children.forEach((child) => render(child, actualDomElement));
    }

    container.appendChild(actualDomElement);
};

const rerender = () => {
    stateCursor = 0;

    document.querySelector("#app").firstChild.remove();

    render(<App />, document.querySelector("#app"));
};

render(<App />, document.querySelector("#app"));
