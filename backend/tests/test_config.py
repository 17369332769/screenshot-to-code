import config


def test_env_flag_true_values(monkeypatch):
    monkeypatch.setenv("TEST_FLAG", "true")
    assert config.env_flag("TEST_FLAG") is True

    monkeypatch.setenv("TEST_FLAG", "1")
    assert config.env_flag("TEST_FLAG") is True


def test_env_flag_false_values(monkeypatch):
    monkeypatch.setenv("TEST_FLAG", "False")
    assert config.env_flag("TEST_FLAG") is False

    monkeypatch.delenv("TEST_FLAG", raising=False)
    assert config.env_flag("TEST_FLAG", default=True) is True


def test_env_list_parses_csv(monkeypatch):
    monkeypatch.setenv(
        "TEST_ORIGINS",
        "https://a.example.com, https://b.example.com ,,",
    )

    assert config.env_list("TEST_ORIGINS") == [
        "https://a.example.com",
        "https://b.example.com",
    ]
